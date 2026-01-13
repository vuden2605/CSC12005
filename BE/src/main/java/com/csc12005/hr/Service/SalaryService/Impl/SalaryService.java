package com.csc12005.hr.Service.SalaryService.Impl;

import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.DTO.Response.SalaryResponse;
import com.csc12005.hr.Entity.*;
import com.csc12005.hr.Enums.SalaryStatus;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Repository.*;
import com.csc12005.hr.Service.MonthlyAttendanceSummaryService.IMonthlyAttendanceSummaryService;
import com.csc12005.hr.Service.MonthlyAttendanceSummaryService.impl.MonthlyAttendanceSummaryService;
import com.csc12005.hr.Service.SalaryService.ISalaryService;
import com.csc12005.hr.Utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SalaryService implements ISalaryService {
    private final SalaryRepository salaryRepository;
    private final EmployeeRepository employeeRepository;
    private final IMonthlyAttendanceSummaryService monthlyAttendanceSummaryService;
    private final SecurityUtils securityUtils;
    @Transactional
    public void generatePayroll()
    {
        LocalDate today = LocalDate.now();
	    LocalDate previousMonth = today.minusMonths(1);
	    Long month = (long) previousMonth.getMonthValue();
	    Long year = (long) previousMonth.getYear();
	    if (salaryRepository.existsByMonthAndYear(month, year)) {
		    throw new AppException(ErrorCode.PAYROLL_ALREADY_GENERATED);
	    }
	    monthlyAttendanceSummaryService.createMonthlyAttendanceSummary(year.intValue(), month.intValue());
		List<Employee> employees = employeeRepository.findAll();
		List<Salary> salaries = new ArrayList<>();
		for (Employee employee : employees) {
			if(employee.getEmployeeCode().equals("ADMIN") || employee.getEmployeeCode().equals("CEO")) continue;
			MonthlyAttendanceSummary attendanceSummary = monthlyAttendanceSummaryService.getMonthlyAttendanceSummary(employee.getId(), year.intValue(), month.intValue());
			if (attendanceSummary == null) {
				log.warn("No attendance summary found for employee ID {} for {}/{}", employee.getId(), month, year);
				continue;
			}
			BigDecimal baseSalary = employee.getBaseSalary();

			BigDecimal socialInsurance = calculateSocialInsurance(baseSalary);
			BigDecimal healthInsurance = calculateHealthInsurance(baseSalary);
			BigDecimal unemploymentInsurance = calculateUnemploymentInsurance(baseSalary);
			BigDecimal totalInsurance = socialInsurance.add(healthInsurance).add(unemploymentInsurance);

			BigDecimal positionAllowance = getPositionAllowance(employee);
			Salary salary = Salary.builder()
					.year(year.intValue())
					.month(month.intValue())
					.attendanceSummary(attendanceSummary)
					.baseSalary(employee.getBaseSalary())
					.actualSalary(attendanceSummary.getActualSalary())
					.lateDeduction(attendanceSummary.getLateDeduction())
					.positionAllowance(positionAllowance)
					.socialInsurance(socialInsurance)
					.healthInsurance(healthInsurance)
					.unemploymentInsurance(unemploymentInsurance)
					.totalInsurance(totalInsurance)
					.employee(employee)
					.build();

			BigDecimal personalDeduction = new BigDecimal("11000000");
			BigDecimal dependentDeduction = new BigDecimal("4400000")
					.multiply(new BigDecimal(employee.getNumberOfDependents()));

			BigDecimal grossSalary = attendanceSummary.getActualSalary()
					.add(positionAllowance)
					.add(salary.getTransportAllowance())
					.add(attendanceSummary.getOvertimePay())
					.add(salary.getMealAllowance());

			BigDecimal taxableIncome = calculateTaxableIncome(
					grossSalary,
					totalInsurance,
					personalDeduction,
					dependentDeduction
			);
			BigDecimal personalIncomeTax = calculatePersonalIncomeTax(taxableIncome);

			BigDecimal totalDeductions = totalInsurance.add(personalIncomeTax).add(attendanceSummary.getLateDeduction());

			BigDecimal netSalary = grossSalary.subtract(totalDeductions);

			salary.setTaxableIncome(taxableIncome);
			salary.setPersonalIncomeTax(personalIncomeTax);
			salary.setGrossSalary(grossSalary);
			salary.setTotalDeductions(totalDeductions);
			salary.setNetSalary(netSalary);
			salaries.add(salary);
		}
		if(!salaries.isEmpty()) {
			salaryRepository.saveAll(salaries);
		}
    }
    public Page<SalaryResponse> getAll(SalaryFilterRequest request, PageRequestDTO pageRequestDTO){
        return salaryRepository.filterSalaries(request.getStatus(),
                request.getMonth(),
                request.getYear(),
                request.getEmployeeName(),
                pageRequestDTO.buildPageable()
        );
    }
    public Page<SalaryResponse> getMySalaries(
            MySalaryFilterRequest request, PageRequestDTO pageRequestDTO    ) {
        long employeeId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        return salaryRepository.findMySalaries(
                employeeId,
                request.getStatus(),
                request.getMonth(),
                request.getYear(),
                pageRequestDTO.buildPageable()
        );
    }
    @Transactional
    public void updateStatus(UpdateSalaryStatus request) {
		SalaryStatus status = request.getStatus();
		List<Salary> salaries = salaryRepository.findAllById(request.getSalaryIds());
		if(salaries.size() != request.getSalaryIds().size()) {
			throw new AppException(ErrorCode.SALARY_NOT_FOUND);
		}
		for(Salary salary : salaries) {
			salary.setStatus(status);
		}
		salaryRepository.saveAll(salaries);
	}

	public BigDecimal calculateSocialInsurance(BigDecimal baseSalary) {
		BigDecimal insuranceBase = getInsuranceBase(baseSalary);

		return insuranceBase
				.multiply(new BigDecimal("0.08"))
				.setScale(0, RoundingMode.HALF_UP);
	}


	private BigDecimal getInsuranceBase(BigDecimal baseSalary) {
		BigDecimal ceiling = new BigDecimal("36000000");
		BigDecimal floor = new BigDecimal("4960000");

		if (baseSalary.compareTo(ceiling) > 0) {
			return ceiling;
		}
		if (baseSalary.compareTo(floor) < 0) {
			return floor;
		}
		return baseSalary;
	}

	private  BigDecimal calculateHealthInsurance(BigDecimal baseSalary) {
		BigDecimal insuranceBase = getInsuranceBase(baseSalary);

		return insuranceBase
				.multiply(new BigDecimal("0.015"))
				.setScale(0, RoundingMode. HALF_UP);
	}

	private BigDecimal calculateUnemploymentInsurance(BigDecimal baseSalary) {
		BigDecimal regionalMinimumWage = new BigDecimal("4680000");
		BigDecimal bhtnCeiling = regionalMinimumWage.multiply(new BigDecimal("20"));

		BigDecimal insuranceBase = baseSalary.min(bhtnCeiling);

		return insuranceBase
				.multiply(new BigDecimal("0.01"))
				.setScale(0, RoundingMode.HALF_UP);
	}

	private BigDecimal calculateTaxableIncome(
			BigDecimal grossSalary,
			BigDecimal totalInsurance,
			BigDecimal personalDeduction,
			BigDecimal dependentDeduction
	) {
		BigDecimal taxableIncome = grossSalary
				.subtract(totalInsurance)
				.subtract(personalDeduction)
				.subtract(dependentDeduction);

		if (taxableIncome. compareTo(BigDecimal. ZERO) < 0) {
			return BigDecimal.ZERO;
		}
		return taxableIncome;
	}
	private BigDecimal calculatePersonalIncomeTax(BigDecimal taxableIncome) {

		if (taxableIncome.compareTo(BigDecimal.ZERO) <= 0) {
			return BigDecimal.ZERO;
		}

		BigDecimal tax = BigDecimal.ZERO;
		BigDecimal remaining = taxableIncome;

		// ========== BẬC 1: đến 5tr - 5% ==========
		if (remaining. compareTo(BigDecimal. ZERO) > 0) {
			BigDecimal bracket = new BigDecimal("5000000");
			BigDecimal taxable = remaining.min(bracket);
			BigDecimal bracketTax = taxable.multiply(new BigDecimal("0.05"));

			tax = tax.add(bracketTax);
			remaining = remaining.subtract(taxable);
		}

		// ========== BẬC 2: >5tr đến 10tr - 10% ==========
		if (remaining. compareTo(BigDecimal. ZERO) > 0) {
			BigDecimal bracket = new BigDecimal("5000000");
			BigDecimal taxable = remaining.min(bracket);
			BigDecimal bracketTax = taxable.multiply(new BigDecimal("0.10"));

			tax = tax.add(bracketTax);
			remaining = remaining.subtract(taxable);
		}

		// ========== BẬC 3: >10tr đến 18tr - 15% ==========
		if (remaining.compareTo(BigDecimal. ZERO) > 0) {
			BigDecimal bracket = new BigDecimal("8000000");
			BigDecimal taxable = remaining.min(bracket);
			BigDecimal bracketTax = taxable.multiply(new BigDecimal("0.15"));

			tax = tax.add(bracketTax);
			remaining = remaining.subtract(taxable);
		}

		// ========== BẬC 4: >18tr đến 32tr - 20% ==========
		if (remaining.compareTo(BigDecimal. ZERO) > 0) {
			BigDecimal bracket = new BigDecimal("14000000");
			BigDecimal taxable = remaining.min(bracket);
			BigDecimal bracketTax = taxable.multiply(new BigDecimal("0.20"));

			tax = tax.add(bracketTax);
			remaining = remaining.subtract(taxable);
		}

		// ========== BẬC 5: >32tr đến 52tr - 25% ==========
		if (remaining.compareTo(BigDecimal. ZERO) > 0) {
			BigDecimal bracket = new BigDecimal("20000000");
			BigDecimal taxable = remaining.min(bracket);
			BigDecimal bracketTax = taxable.multiply(new BigDecimal("0.25"));

			tax = tax.add(bracketTax);
			remaining = remaining.subtract(taxable);
		}

		// ========== BẬC 6: >52tr đến 80tr - 30% ==========
		if (remaining.compareTo(BigDecimal. ZERO) > 0) {
			BigDecimal bracket = new BigDecimal("28000000");
			BigDecimal taxable = remaining.min(bracket);
			BigDecimal bracketTax = taxable.multiply(new BigDecimal("0.30"));

			tax = tax.add(bracketTax);
			remaining = remaining.subtract(taxable);
		}

		// ========== BẬC 7: >80tr - 35% ==========
		if (remaining.compareTo(BigDecimal.ZERO) > 0) {
			BigDecimal bracketTax = remaining.multiply(new BigDecimal("0.35"));
			tax = tax.add(bracketTax);
		}

		return tax.setScale(0, RoundingMode.HALF_UP);
	}
	private BigDecimal getPositionAllowance(Employee employee) {
		if (employee != null && employee.getPosition().getRole() != null) {
			String role = employee.getPosition().getRole().toString();
			return switch (role) {
				case "MN" -> BigDecimal.valueOf(2000000);
				case "HR" -> BigDecimal.valueOf(1000000);
				default -> BigDecimal.valueOf(500000);
			};
		} else {
			 return BigDecimal.ZERO;
		}
	}
	private void validatePayrollGenerationDate(Long year, Long month) {
		LocalDate today = LocalDate.now();
		YearMonth yearMonth = YearMonth.of(year. intValue(), month.intValue());
		int lastDayOfMonth = yearMonth. lengthOfMonth();
		int currentDay = today.getDayOfMonth();

		if (currentDay != lastDayOfMonth) {
			throw new AppException(ErrorCode.PAYROLL_GENERATION_DATE_INVALID);
		}
	}
	public String generateQRPayRoll(Long salaryId) {
		Salary salary = salaryRepository.findById(salaryId)
				.orElseThrow(() -> new AppException(ErrorCode.SALARY_NOT_FOUND));

		Employee employee = salary.getEmployee();
		String bankAccount = employee.getBankAccount();
		String bankBin = getBankBin(employee.getBankName());
		BigDecimal amount = salary.getNetSalary();
		String message = "Chi luong thang " + salary.getMonth()
				+ " cho " + employee.getFullName();
		String accountName = employee.getFullName();
		return String.format(
				"https://api.vietqr.io/image/%s-%s-compact2.png" +
						"?amount=%s&addInfo=%s&accountName=%s",
				bankBin,
				bankAccount,
				amount.toPlainString(),
				URLEncoder.encode(message, StandardCharsets.UTF_8),
				URLEncoder.encode(accountName, StandardCharsets.UTF_8)
		);



	}
	private String getBankBin(String bankName) {
		return switch (bankName.toUpperCase()) {
			case "VIETCOMBANK" -> "970436";
			case "VIETINBANK" -> "970415";
			case "BIDV" -> "970418";
			case "ACB" -> "970416";
			default -> throw new AppException(ErrorCode.BANK_NOT_SUPPORTED);
		};
	}
}

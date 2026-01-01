package com.csc12005.hr.Service.SalaryService.Impl;

import com.csc12005.hr.DTO.Request.MySalaryFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.SalaryCreationRequest;
import com.csc12005.hr.DTO.Request.SalaryFilterRequest;
import com.csc12005.hr.DTO.Response.SalaryResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Salary;
import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.SalaryRepository;
import com.csc12005.hr.Repository.TimeSheetRepository;
import com.csc12005.hr.Service.SalaryService.ISalaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class SalaryService implements ISalaryService {
    private final SalaryRepository salaryRepository;
    private final EmployeeRepository employeeRepository;
    private final TimeSheetRepository timeSheetRepository;
    @Transactional
    public void generatePayroll( Long month, Long year)
    {
        LocalDate today = LocalDate.now();
        int currentDay = today.getDayOfMonth();
        List<Salary> salaries=salaryRepository.findAll();

        if (currentDay != 30 && currentDay != 31)
            throw new AppException(ErrorCode.PAYROLL_NOT_PAYMENT_DAY);

        boolean existed = salaryRepository.existsByMonthAndYear(month, year);

        if (existed) {
            throw new AppException(ErrorCode.PAYROLL_ALREADY_GENERATED);
        }

        List<Employee> employees= employeeRepository.findAll();
        for(Employee emp:employees){
            // lấy base salary theo giờ
            double  hourlySalary = (double) emp.getBaseSalary() /(22*8);
            // Lấy time sheet
            List<TimeSheet> timeSheets =
                    timeSheetRepository.findApprovedByEmployeeAndMonth(
                            emp.getId(), month, year
                    );
            if (timeSheets.isEmpty()) continue;
            // tính tổng gio
            double totalWorkedHours = timeSheets.stream()
                    .filter(ts ->
                            ts.getCheckIn() != null &&
                                    ts.getCheckOut() != null &&
                                    !ts.getCheckOut().isBefore(ts.getCheckIn())
                    )
                    .mapToDouble(ts -> {
                        Duration duration = Duration.between(
                                ts.getCheckIn(),
                                ts.getCheckOut()
                        );
	                    return duration.toMinutes() / 60.0;
                    })
                    .sum();
            double totalPay = totalWorkedHours * hourlySalary;

            Salary salary = Salary.builder()
                    .employee(emp)
                    .month(month)
                    .year(year)
                    .workTime(totalWorkedHours)
                    .totalPay(totalPay)
                    .build();

            salaryRepository.save(salary);
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
    public void paySalary(Long month, Long year) {
        boolean exists = salaryRepository.existsByMonthAndYear(month, year);
        if (!exists) {
            throw new AppException(ErrorCode.PAYROLL_NOT_GENERATED);
        }
        int updated = salaryRepository.paySalary(month, year);
        if (updated == 0) {
            throw new AppException(ErrorCode.PAYROLL_ALREADY_PAID);
        }
	}
}

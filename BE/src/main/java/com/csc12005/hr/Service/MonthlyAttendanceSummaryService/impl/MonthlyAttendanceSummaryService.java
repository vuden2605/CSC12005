package com.csc12005.hr.Service.MonthlyAttendanceSummaryService.impl;

import com.csc12005.hr.DTO.Request.MonthlyAttendanceSummaryCreationRequest;
import com.csc12005.hr.DTO.Response.MonthlyAttendanceAggResponse;
import com.csc12005.hr.DTO.Response.MonthlyAttendanceSummaryResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.MonthlyAttendanceSummary;
import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Repository.*;
import com.csc12005.hr.Repository.TimeSheetRequestRepository;
import com.csc12005.hr.Service.MonthlyAttendanceSummaryService.IMonthlyAttendanceSummaryService;
import com.csc12005.hr.Utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MonthlyAttendanceSummaryService implements IMonthlyAttendanceSummaryService {
	private static final int STANDARD_WORK_DAYS = 22;
	private static final BigDecimal STANDARD_WORK_DAYS_BD = new BigDecimal("22");
	private static final BigDecimal HOURS_PER_DAY = new BigDecimal("8");
	private static final BigDecimal OVERTIME_MULTIPLIER = new BigDecimal("1.5");

	private final MonthlyAttendanceSummaryRepository monthlyAttendanceSummaryRepository;;
	private final TimeSheetRepository timeSheetRepository;
	private final EmployeeRepository employeeRepository;
	private final PublicHolidayRepository publicHolidayRepository;

	@Override
	@Transactional
	public void createMonthlyAttendanceSummary(int year, int month) {
		List<Employee> employees = employeeRepository.findAll();
		List<MonthlyAttendanceSummary> summaries = new ArrayList<>();
		for(Employee employee : employees) {
			if("ADMIN".equals(employee.getEmployeeCode()) || "CEO".equals(employee.getEmployeeCode())) {
				continue;
			}
			Long employeeId = employee.getId();
			int publicHolidays = publicHolidayRepository.countByYearAndMonth(year, month);
			MonthlyAttendanceAggResponse aggregate  = timeSheetRepository.aggregateMonthlyAttendance(
					employeeId,
					year,
					month

			);
			if (aggregate == null) continue;
			BigDecimal baseSalary = employee.getBaseSalary();
			BigDecimal actualSalary = calculateActualSalary(baseSalary, aggregate.getTotalWorkDays().intValue(), publicHolidays);
			BigDecimal overtimePay = calculateOvertimePay(
					baseSalary,
					aggregate.getTotalOvertimeHours()
			);
			BigDecimal lateDeduction = calculateLateDeduction(
					employee.getId(),
					year,
					month,
					baseSalary
			);
			int totalWorkDays = aggregate.getTotalWorkDays().intValue();
			int absentDays = Math.max(0, STANDARD_WORK_DAYS - totalWorkDays - publicHolidays);

			MonthlyAttendanceSummary summary = MonthlyAttendanceSummary.builder()
					.employee(employee)
					.year(year)
					.month(month)
					.totalWorkDays(totalWorkDays)
					.totalAbsentDays(absentDays)
					.totalLateDays(aggregate.getTotalLateDays().intValue())
					.totalWorkHours(aggregate.getTotalWorkHours())
					.totalOvertimeHours(aggregate.getTotalOvertimeHours())
					.baseSalary(baseSalary)
					.overtimePay(overtimePay)
					.lateDeduction(lateDeduction)
					.actualSalary(actualSalary)
					.build();
			summaries.add(summary);
		}
		if (!summaries.isEmpty()) {
			monthlyAttendanceSummaryRepository.saveAll(summaries);
		}
	}

	private BigDecimal calculateActualSalary(
			BigDecimal baseSalary,
			int workDays,
			int publicHolidays
	) {
		int totalDays = workDays + publicHolidays;

		return baseSalary
				.multiply(new BigDecimal(totalDays))
				.divide(STANDARD_WORK_DAYS_BD, 0, RoundingMode.HALF_UP);
	}

	private BigDecimal calculateOvertimePay(
			BigDecimal baseSalary,
			BigDecimal overtimeHours
	) {
		if (overtimeHours == null || overtimeHours.compareTo(BigDecimal.ZERO) <= 0) {
			return BigDecimal.ZERO;
		}

		BigDecimal hourlyRate = baseSalary
				.divide(STANDARD_WORK_DAYS_BD, 2, RoundingMode.HALF_UP)
				.divide(HOURS_PER_DAY, 2, RoundingMode.HALF_UP);

		return hourlyRate
				.multiply(overtimeHours)
				.multiply(OVERTIME_MULTIPLIER)
				.setScale(0, RoundingMode.HALF_UP);
	}

	private BigDecimal calculateLateDeduction(
			Long employeeId,
			int year,
			int month,
			BigDecimal baseSalary
	) {
		List<TimeSheet> timeSheets = timeSheetRepository
				.findTimesheetsByMonth(employeeId, year, month);

		BigDecimal totalLateDeduction = BigDecimal.ZERO;
		BigDecimal dailySalary = baseSalary.divide(
				STANDARD_WORK_DAYS_BD,
				2,
				RoundingMode. HALF_UP
		);

		for (TimeSheet ts : timeSheets) {
			if (ts.getType() == null) continue;

			if ("LATE".equals(ts.getType().name()) &&
					ts.getLateDeductionRate() != null &&
					ts.getLateMinutes() != null &&
					ts.getLateMinutes() > 0) {

				BigDecimal deduction = dailySalary
						.multiply(ts.getLateDeductionRate()).divide(
								new BigDecimal("100"),
								2,
								RoundingMode.HALF_UP
						);
				totalLateDeduction = totalLateDeduction.add(deduction);
			}
		}
		return totalLateDeduction.setScale(0, RoundingMode.HALF_UP);
	}
	public MonthlyAttendanceSummary getMonthlyAttendanceSummary(Long employeeId, int year, int month) {
		return monthlyAttendanceSummaryRepository
				.findByEmployeeIdAndMonthAndYear(employeeId, year, month)
				.orElse(null);
	}
}

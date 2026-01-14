package com.csc12005.hr.Service;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.PointHistory;
import com.csc12005.hr.Enums.EmployeeRole;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Service.MonthlyAttendanceSummaryService.impl.MonthlyAttendanceSummaryService;
import com.csc12005.hr.Service.PointHistoryService.Impl.PointHistoryService;
import com.csc12005.hr.Service.SalaryService.Impl.SalaryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


@RequiredArgsConstructor
@Service
public class ScheduleJob {
	private final EmployeeRepository employeeRepository;
	private final SalaryService salaryService;
	private final PointHistoryService pointHistoryService;
	@Scheduled(
			cron = "0 44 0 14 * ?",
			zone = "Asia/Ho_Chi_Minh"
	)
	@Transactional
	public void grantAllocatePointsToManagers() {
		employeeRepository.increasePointsForRole(EmployeeRole.MN);
	}

	@Scheduled(
			cron = "0 22 10 14 * ?",
			zone = "Asia/Ho_Chi_Minh"
	)
	@Transactional
	public void generateSalaries() {
		LocalDate now = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"));
		LocalDate lastMonth = now.minusMonths(1);
		int year = lastMonth.getYear();
		int month = lastMonth.getMonthValue();
		salaryService.generatePayroll(month, year);
	}

	@Scheduled
	(
			cron = "0 13 11 14 * ?",
			zone = "Asia/Ho_Chi_Minh"
	)
	@Transactional
	public void grantMonthlyPointsToEmployees() {
		List<Employee> employees = employeeRepository.findAllWithPosition();
		pointHistoryService.givePointToMonthlyCandidates(employees);
	}


}

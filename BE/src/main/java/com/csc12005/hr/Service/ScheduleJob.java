package com.csc12005.hr.Service;

import com.csc12005.hr.Entity.Activity;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.PointHistory;
import com.csc12005.hr.Enums.ActivityStatus;
import com.csc12005.hr.Enums.EmployeeRole;
import com.csc12005.hr.Repository.ActivityRepository;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Service.MonthlyAttendanceSummaryService.impl.MonthlyAttendanceSummaryService;
import com.csc12005.hr.Service.PointHistoryService.Impl.PointHistoryService;
import com.csc12005.hr.Service.SalaryService.Impl.SalaryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;


@RequiredArgsConstructor
@Service
public class ScheduleJob {
	private final EmployeeRepository employeeRepository;
	private final SalaryService salaryService;
	private final PointHistoryService pointHistoryService;
	private final ActivityRepository activityRepository;
	@Scheduled(
			cron = "0 44 0 14 * ?",
			zone = "Asia/Ho_Chi_Minh"
	)
	@Transactional
	public void grantAllocatePointsToManagers() {
		employeeRepository.increasePointsForRole(EmployeeRole.MN);
	}

	@Scheduled(
			cron = "00 22 10 15 * ?",
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
			cron = "30 16 10 15 * ?",
			zone = "Asia/Ho_Chi_Minh"
	)
	@Transactional
	public void grantMonthlyPointsToEmployees() {
		List<Employee> employees = employeeRepository.findAllWithPosition();
		pointHistoryService.givePointToMonthlyCandidates(employees);
	}

	@Scheduled(
			cron = "0 0 0 * * ?",
			zone = "Asia/Ho_Chi_Minh"
	)
	@Transactional
	public void updateActivityStatus() {
		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

		List<Activity> activities =
				activityRepository.findActivitiesNeedStatusUpdate();

		for (Activity activity : activities) {

			LocalDateTime startDateTime =
					LocalDateTime.of(activity.getStartDate(), activity.getStartTime());

			LocalDateTime endDateTime =
					LocalDateTime.of(activity.getEndDate(), activity.getEndTime());

			ActivityStatus oldStatus = activity.getActivityStatus();
			ActivityStatus newStatus = oldStatus;

			if (now.isAfter(activity.getRegistrationDeadline())
					&& now.isBefore(startDateTime)) {
				newStatus = ActivityStatus.REGISTRATION_CLOSED;

			} else if (!now.isBefore(startDateTime)
					&& !now.isAfter(endDateTime)) {
				newStatus = ActivityStatus.ONGOING;

			} else if (now.isAfter(endDateTime)) {
				newStatus = ActivityStatus.COMPLETED;
			}

			if (newStatus != oldStatus) {
				activity.setActivityStatus(newStatus);
			}
		}
	}

}

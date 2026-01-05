package com.csc12005.hr.Service.MonthlyAttendanceSummaryService;

import com.csc12005.hr.DTO.Request.MonthlyAttendanceSummaryCreationRequest;
import com.csc12005.hr.Entity.MonthlyAttendanceSummary;

public interface IMonthlyAttendanceSummaryService {
	void createMonthlyAttendanceSummary(int year, int month);
	MonthlyAttendanceSummary getMonthlyAttendanceSummary(Long employeeId, int year, int month);
}

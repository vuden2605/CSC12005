package com.csc12005.hr.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class MonthlyAttendanceAggResponse {
	private Long employeeId;
	private Integer year;
	private Integer month;

	private Long totalWorkDays;

	private Long totalLateDays;

	private BigDecimal totalWorkHours;

	private BigDecimal totalOvertimeHours;
}

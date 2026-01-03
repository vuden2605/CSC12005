package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Enums.AttendanceStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MonthlyAttendanceSummaryResponse {

	private Long id;

	private String employeeName;

	private String employeeCode;

	private Integer year;

	private Integer month;

	private Integer totalWorkDays;

	private Integer totalAbsentDays;

	private Integer totalLateDays;

	private BigDecimal totalWorkHours;

	private BigDecimal totalOvertimeHours;

	private BigDecimal baseSalary;

	private BigDecimal actualSalary;

	private BigDecimal overtimePay;

	private BigDecimal lateDeduction;

	private AttendanceStatus status;
}

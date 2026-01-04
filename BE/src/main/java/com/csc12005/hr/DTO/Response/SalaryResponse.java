package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Enums.SalaryStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryResponse {
	private Long id;

	private Integer year;

	private Integer month;

	private BigDecimal baseSalary;

	private BigDecimal actualSalary;

	private BigDecimal lateDeduction;

	private BigDecimal positionAllowance;

	private BigDecimal transportAllowance;

	private BigDecimal mealAllowance;

	private BigDecimal socialInsurance;

	private BigDecimal healthInsurance;

	private BigDecimal unemploymentInsurance;

	private BigDecimal totalInsurance;

	private BigDecimal taxableIncome;

	private BigDecimal personalIncomeTax;

	private BigDecimal grossSalary;

	private BigDecimal totalDeductions;

	private BigDecimal netSalary;

	private SalaryStatus status;

	private LocalDateTime approvedAt;

	private LocalDateTime paidAt;

	private String payslipUrl;

	private String employeeName;

	private String employeeCode;

	private Long employeeId;

	private String positionName;

	private MonthlyAttendanceSummaryResponse attendanceSummary;
}

package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.SalaryStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "salaries")
public class Salary {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Integer year;

	private Integer month;
	@OneToOne
	@JoinColumn(name = "attendance_summary_id")
	private MonthlyAttendanceSummary attendanceSummary;

	private BigDecimal baseSalary;

	private BigDecimal actualSalary;

	private BigDecimal lateDeduction;

	private BigDecimal positionAllowance;

 	@Builder.Default
	private BigDecimal transportAllowance = BigDecimal.valueOf(500000);

	@Builder.Default
	private BigDecimal mealAllowance = BigDecimal.valueOf(700000);

	private BigDecimal socialInsurance;

	private BigDecimal healthInsurance;

	private BigDecimal unemploymentInsurance;

	private BigDecimal totalInsurance;

	private BigDecimal taxableIncome;

	private BigDecimal personalIncomeTax;

	private BigDecimal grossSalary;

	private BigDecimal totalDeductions;

	private BigDecimal netSalary;

	@Builder.Default
	@Enumerated(EnumType.STRING)
	private SalaryStatus status = SalaryStatus.DRAFT;

    @ManyToOne
	@JoinColumn(name = "employee_id")
	private Employee employee;

	private LocalDateTime approvedAt;

	private LocalDateTime paidAt;

	private String payslipUrl;


}

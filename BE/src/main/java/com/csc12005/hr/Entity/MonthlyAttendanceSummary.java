package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.AttendanceStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Locale;

@Entity
@Table(
	name = "monthly_attendance_summaries",
	uniqueConstraints = {
		@UniqueConstraint(columnNames = {"employee_id", "year", "month"})
	},
	indexes =  {
		@Index(name = "idx_employee_year_month", columnList = "employee_id, year, month")
	}
)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class MonthlyAttendanceSummary {
	@Id
	@GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee;

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

	@Enumerated(EnumType.STRING)
	@Builder.Default
	private AttendanceStatus status = AttendanceStatus.DRAFT;
}

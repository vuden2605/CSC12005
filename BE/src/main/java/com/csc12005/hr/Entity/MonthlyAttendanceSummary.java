package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.AttendanceStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "monthly_attendance_summaries")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
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

	private Integer totalPresentDays;

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

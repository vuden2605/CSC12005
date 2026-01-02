package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.TimeSheetType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "timesheets",
		uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "work_date", "type"}, name = "uk_employee_workday_type"))
public class TimeSheet {
	private static final LocalTime DAY_START = LocalTime.of(8, 0);
	private static final LocalTime DAY_END   = LocalTime.of(17, 0);
	private static final LocalTime OT_START  = LocalTime.of(18, 0);
	private static final LocalTime OT_END    = LocalTime.of(22, 0);

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private LocalDate workDate;

	private LocalTime checkIn;

	private LocalTime checkOut;

	@Enumerated(EnumType.STRING)
	private TimeSheetType type;

	@ManyToOne
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Column(precision = 4, scale = 2)
	@Builder.Default
	private BigDecimal workHours = BigDecimal. ZERO;

	@Builder. Default
	private Integer lateMinutes = 0;

	@Builder.Default
	@Column(nullable = false)
	private Boolean isAdjusted = false;

	@Column(columnDefinition = "TEXT")
	private String adjustmentReason;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "request_id")
	private Request request;

	@Column(nullable = false, name = "is_work_on_holiday")
	@Builder.Default
	private Boolean isWorkOnHoliday = false;

	@CreationTimestamp
	@Column(nullable = false, updatable = false, name = "created_at")
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(nullable = false, name = "updated_at")
	private LocalDateTime updatedAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "created_by")
	private Employee createdBy;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "updated_by")
	private Employee updatedBy;

	@Version
	private Long version;

	public void calculateAll() {
		normalizeCheckInOut();
		calculateLateMinutes();
		calculateWorkHours();
		determineType();
	}

	private void calculateLateMinutes() {
		if (checkIn == null || checkIn.isBefore(DAY_START)) {
			this.lateMinutes = 0;
			return;
		}

		Duration duration = Duration.between(DAY_START, checkIn);
		this.lateMinutes = (int) duration.toMinutes();
	}

	private void calculateWorkHours() {
		if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
			this.workHours = BigDecimal.ZERO;
			return;
		}

		long totalMinutes = Duration.between(checkIn, checkOut).toMinutes();

		this.workHours = BigDecimal.valueOf(totalMinutes)
				.divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
	}
	private void normalizeCheckInOut() {
		if (checkIn != null) {
			if (checkIn.isBefore(DAY_START)) {
				checkIn = DAY_START;
			} else if (checkIn.isAfter(DAY_END) && checkIn.isBefore(OT_START)) {
				checkIn = OT_START;
			}
		}

		if (checkOut != null) {
			if (checkOut.isAfter(OT_END)) {
				checkOut = OT_END;
			} else if (checkOut.isAfter(DAY_END)
					&& checkIn != null
					&& checkIn.isBefore(DAY_END)) {
				checkOut = DAY_END;
			}
		}
	}
	private void determineType() {
		if (checkIn == null) {
			return;
		}
		if (checkIn.equals(LocalTime.of(18, 0))) {
			this.type = TimeSheetType.OVERTIME;
		} else if (lateMinutes > 15) {
			this.type = TimeSheetType.LATE;
		} else {
			this.type = TimeSheetType.PRESENT;
		}
	}
}

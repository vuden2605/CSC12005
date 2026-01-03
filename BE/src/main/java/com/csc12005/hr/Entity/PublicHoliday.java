package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.HolidayType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "public_holidays",
		indexes = {
				@Index(name = "idx_holiday", columnList = "year, month, is_active")
		}
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicHoliday {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 200, name = "holiday_name")
	private String holidayName;

	@Column(nullable = false, name = "holiday_date")
	private LocalDate holidayDate;

	@Column(nullable = false)
	private Integer year;

	@Column(nullable = false)
	private Integer month;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30, name = "holiday_type")
	@Builder.Default
	private HolidayType holidayType = HolidayType.FIXED_DATE;

	@Column(nullable = false, name = "is_paid")
	@Builder.Default
	private Boolean isPaid = true;

	@Column(name = "salary_multiplier")
	@Builder.Default
	private BigDecimal salaryMultiplier = BigDecimal.ONE;

	@Column(columnDefinition = "TEXT")
	private String description;
	;

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

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;

	@ManyToOne(fetch = FetchType. LAZY)
	@JoinColumn(name = "deleted_by")
	private Employee deletedBy;

	private Boolean isActive;
}

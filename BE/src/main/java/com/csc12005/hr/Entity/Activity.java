package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.ActivityStatus;
import com.csc12005.hr.Enums.ActivityType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "activities")
public class Activity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@Column(nullable = false, length = 200)
	private String activityName;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ActivityType activityType;

	@Column(nullable = false)
	private LocalDate startDate;

	@Column(nullable = false)
	private LocalDate endDate;

	@Column(nullable = false)
	private LocalTime startTime;

	@Column(nullable = false)
	private LocalTime endTime;

	private Integer duration;

	@Column(nullable = false)
	private LocalDateTime registrationDeadline;

	@Column(length = 200)
	private String location;

	@Column(length = 500)
	private String address;

	@Column(length = 200)
	private String organizer;

	@Column(length = 20)
	private String contactPhone;

	@Column(length = 100)
	private String contactEmail;

	private Integer minParticipants;

	@Column(nullable = false)
	private Integer maxParticipants;

	@Builder.Default
	@Column(nullable = false)
	private Integer registeredCount = 0;

	@Builder.Default
	private Boolean isMandatory = false;

	@Column(nullable = false)
	private Long basePoints;

	private Long firstPlaceBonus;

	private Long secondPlaceBonus;

	private Long thirdPlaceBonus;

	@Enumerated(EnumType.STRING)
	@Builder.Default
	@Column(nullable = false)
	private ActivityStatus activityStatus = ActivityStatus.DRAFT;

	@Builder.Default
	private Boolean isActive = true;

	@Column(columnDefinition = "TEXT")
	private String attachmentUrl;

	@Column(columnDefinition = "TEXT")
	private String notes;
	private String imageUrl;

	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	private LocalDateTime updatedAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "created_by")
	private Employee createdBy;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "updated_by")
	private Employee updatedBy;

	private boolean isRegistrationOpen() {
		return activityStatus == ActivityStatus.OPEN_FOR_REGISTRATION
				&& registrationDeadline != null
				&& LocalDateTime.now().isBefore(registrationDeadline)
				&& registeredCount < maxParticipants;
	}
	public boolean isFull() {
		return registeredCount >= maxParticipants;
	}
	public int getAvailableSlots() {
		return maxParticipants - registeredCount;
	}
	public boolean canRegister() {
		return isRegistrationOpen() && !isFull();
	}
	public boolean canCancel() {
		return registrationDeadline != null
				&& LocalDateTime.now().isBefore(registrationDeadline);
	}
}

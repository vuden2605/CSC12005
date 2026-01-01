package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Enums.ActivityStatus;
import com.csc12005.hr.Enums.ActivityType;
import com.fasterxml.jackson.annotation.JsonInclude;
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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ActivityResponse {

	private Long id;

	private String activityName;

	private String description;

	private ActivityType activityType;

	private LocalDate startDate;

	private LocalDate endDate;

	private LocalTime startTime;

	private LocalTime endTime;

	private Integer duration;

	private LocalDateTime registrationDeadline;

	private String location;

	private String address;

	private String organizer;

	private String contactPhone;

	private String contactEmail;

	private Integer minParticipants;

	private Integer maxParticipants;

	private Integer registeredCount ;

	private Boolean isMandatory;

	private Long basePoints;

	private Long firstPlaceBonus;

	private Long secondPlaceBonus;

	private Long thirdPlaceBonus;

	private ActivityStatus activityStatus;

	private Boolean isActive;

	private String attachments;

	private String notes;

	private String imageUrl;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	private String employeeCreatedName;

	private String employeeCreatedCode;

	private String employeeUpdatedName;

	private String employeeUpdatedCode;

}

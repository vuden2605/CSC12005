package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.ActivityType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityCreationRequest {
	@NotBlank(message = "REQUIRED_ACTIVITY_NAME")
	private String activityName;

	private String description;

	@NotNull(message = "REQUIRED_ACTIVITY_TYPE")
	private ActivityType activityType;

	@NotNull(message = "REQUIRED_START_DATE")
	private LocalDate startDate;

	@NotNull(message = "REQUIRED_END_DATE")
	private LocalDate endDate;

	@NotNull(message = "REQUIRED_START_TIME")
	private LocalTime startTime;

	@NotNull(message = "REQUIRED_END_TIME")
	private LocalTime endTime;

	private Integer duration;

	@NotNull(message = "REQUIRED_REGISTRATION_DEADLINE")
	private LocalDateTime registrationDeadline;

	@NotBlank(message = "REQUIRED_LOCATION")
	private String location;

	@NotBlank(message = "REQUIRED_ACTIVITY_ADDRESS")
	private String address;

	@NotBlank(message = "REQUIRED_ORGANIZER")
	private String organizer;

	@NotBlank(message = "REQUIRED_CONTACT_PHONE")
	@Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "INVALID_PHONE")
	private String contactPhone;

	@NotBlank(message = "REQUIRED_CONTACT_EMAIL")
	@Email
	private String contactEmail;

	private Integer minParticipants;

	@NotNull(message = "REQUIRED_MAX_PARTICIPANTS")
	private Integer maxParticipants;

	private Boolean isMandatory;

	@NotNull(message = "REQUIRED_ACTIVITY_POINTS")
	private Long basePoints;

	private Long firstPlaceBonus;

	private Long secondPlaceBonus;

	private Long thirdPlaceBonus;

	private MultipartFile attachment;

	private String notes;

	@NotNull(message = "REQUIRED_ACTIVITY_IMAGE")
	private MultipartFile image;
}

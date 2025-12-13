package com.csc12005.hr.DTO.Request;

import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityCreationRequest {
	@NotBlank(message = "REQUIRED_ACTIVITY_NAME")
	private String activityName;
	@NotBlank(message = "REQUIRED_ACTIVITY_DESCRIPTION")
	private String description;
	@NotNull(message = "REQUIRED_START_DATE")
	private LocalDate startDate;
	@NotNull(message = "REQUIRED_END_DATE")
	private LocalDate endDate;
	@NotNull(message = "REQUIRED_POINTS")
	private Long points;
	@NotNull(message = "REQUIRED_COUNT")
	private Long count;
}

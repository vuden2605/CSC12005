package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WFHCreationRequest {
	@NotNull(message = "REQUIRED_REQUEST_ATTACHMENT")
	private MultipartFile file;
	@NotBlank(message = "REQUIRED_REASON")
	private String reason;
	@NotNull(message = "REQUIRED_START_DATE")
	private LocalDate startDate;
	@NotNull(message = "REQUIRED_END_DATE")
	private LocalDate endDate;
	@AssertTrue(message = "START_DATE_MUST_BE_BEFORE_END_DATE")
	private boolean isStartDateBeforeEndDate() {
		if (startDate == null || endDate == null) {
			return true;
		}
		return startDate.isBefore(endDate);
	}
}

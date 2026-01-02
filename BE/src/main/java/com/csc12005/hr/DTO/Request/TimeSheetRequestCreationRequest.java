package com.csc12005.hr.DTO.Request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSheetRequestCreationRequest {
	@NotNull(message = "REQUIRED_REQUEST_ATTACHMENT")
	private MultipartFile file;

	@NotBlank(message = "REQUIRED_REASON")
	private String reason;

	@JsonFormat(pattern = "HH:mm:ss")
	@NotNull(message = "REQUIRED_CHECK_IN_NEW")
	private LocalTime checkInNew;

	@JsonFormat(pattern = "HH:mm:ss")
	@NotNull(message = "REQUIRED_CHECK_OUT_NEW")
	private LocalTime checkOutNew;

	@JsonFormat(pattern = "yyyy-MM-dd")
	@NotNull(message = "REQUIRED_WORK_DATE")
	private LocalDate workDate;

	@AssertTrue(message = "CHECK_IN_MUST_BE_BEFORE_CHECK_OUT")
	private boolean isCheckInBeforeCheckout() {
		if (checkInNew == null || checkOutNew == null) {
			return true;
		}
		return checkInNew.isBefore(checkOutNew);
	}
}

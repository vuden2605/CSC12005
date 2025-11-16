package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.TimeSheetStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSheetRequestCreationRequest {
	@NotNull(message = "REQUIRED_TIMESHEET_ID")
	private Long timeSheetId;
	@NotBlank(message = "REQUIRED_REQUEST_ATTACHMENT")
	private String requestAttachment;
	@NotBlank(message = "REQUIRED_REASON")
	private String reason;
	@JsonFormat(pattern = "HH:mm:ss")
	@NotNull(message = "REQUIRED_CHECK_IN_NEW")
	private LocalTime checkInNew;
	@JsonFormat(pattern = "HH:mm:ss")
	@NotNull(message = "REQUIRED_CHECK_OUT_NEW")
	private LocalTime checkOutNew;
	@AssertTrue(message = "CHECK_IN_MUST_BE_BEFORE_CHECK_OUT")
	private boolean isCheckInBeforeCheckout() {
		if (checkInNew == null || checkOutNew == null) {
			return true;
		}
		return checkInNew.isBefore(checkOutNew);
	}
}

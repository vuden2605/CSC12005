package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.LeaveType;
import com.csc12005.hr.Enums.RequestType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestCreationRequest {
	@NotNull(message = "REQUIRED_REQUEST_ATTACHMENT")
	private MultipartFile file;
	@NotBlank(message = "REQUIRED_REASON")
	private String reason;

	private LocalDateTime startDate;

	private LocalDateTime endDate;

	@JsonFormat(pattern = "HH:mm:ss")
	private LocalTime checkInNew;

	@JsonFormat(pattern = "HH:mm:ss")
	private LocalTime checkOutNew;

	private LocalDate workDate;

	private LeaveType leaveType;
}

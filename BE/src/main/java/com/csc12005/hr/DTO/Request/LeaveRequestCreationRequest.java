package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeaveRequestCreationRequest {
	@NotNull(message = "REQUIRED_REQUEST_ATTACHMENT")
	private MultipartFile file;
	@NotNull(message = "REQUIRED_START_DATE")
	private LocalDateTime startDate;
	@NotNull(message = "REQUIRED_END_DATE")
	private LocalDateTime endDate;
}

package com.csc12005.hr.DTO.Request;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WFHCreationRequest {
	private String requestAttachment;
	private String reason;
	private LocalDate startDate;
	private LocalDate endDate;
}

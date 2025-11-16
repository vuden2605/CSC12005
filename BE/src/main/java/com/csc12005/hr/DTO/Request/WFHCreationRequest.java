package com.csc12005.hr.DTO.Request;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WFHCreationRequest {
	private String requestAttachment;
	private String reason;
	private LocalDateTime startDate;
	private LocalDateTime endDate;
}

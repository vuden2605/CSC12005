package com.csc12005.hr.DTO.Request;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestCreationRequest {
	private String requestAttachment;
	private String reason;
}

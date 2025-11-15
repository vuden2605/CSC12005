package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.RequestStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestCreationRequest {
	private String requestAttachment;
	private String reason;
}

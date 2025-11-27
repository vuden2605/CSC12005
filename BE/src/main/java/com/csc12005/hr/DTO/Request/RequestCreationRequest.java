package com.csc12005.hr.DTO.Request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestCreationRequest {
	private MultipartFile file;
	private String reason;
}

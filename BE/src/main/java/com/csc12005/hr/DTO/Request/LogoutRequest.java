package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogoutRequest {
	@NotBlank(message = "REQUIRED_ACCESS_TOKEN")
	private String accessToken;
}

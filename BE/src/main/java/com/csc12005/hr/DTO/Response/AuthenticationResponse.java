package com.csc12005.hr.DTO.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationResponse {
	private String accessToken;
	private String refreshToken;
	private boolean isAuthenticated;
}

package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.LoginRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.AuthenticationResponse;
import com.csc12005.hr.Service.AuthenticationService.impl.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {
	private final AuthenticationService authenticationService;
	@PostMapping("/auth/login")
	public ResponseEntity<ApiResponse<AuthenticationResponse>> login(@RequestBody @Valid LoginRequest loginRequest) {
		AuthenticationResponse authResponse = authenticationService.login(loginRequest);
		ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", authResponse.getRefreshToken())
				.httpOnly(true)
				.secure(true)
				.path("/refresh-token")
				.maxAge(7 * 24 * 60 * 60)
				.build();
		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
				.body(ApiResponse.<AuthenticationResponse>builder()
						.message("Login successful")
						.data(authResponse)
						.build()
		);
	}
	@PostMapping("/auth/refresh-token")
	public ApiResponse<AuthenticationResponse> refreshAccessToken(@CookieValue(value = "refreshToken", required = true) String refreshToken) {
		AuthenticationResponse authResponse = authenticationService.refreshAccessToken(refreshToken);
		return ApiResponse.<AuthenticationResponse>builder()
				.message("Access token refreshed successfully")
				.data(authResponse)
				.build();
	}
	@PostMapping("/auth/logout")
	public ResponseEntity<ApiResponse<String>>  logout() {
		ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
				.httpOnly(true)
				.secure(true)
				.path("/refresh-token")
				.maxAge(0)
				.build();
		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
				.body(ApiResponse.<String>builder()
						.message("Logout successful")
						.data("Logged out")
						.build()
		);
	}
}

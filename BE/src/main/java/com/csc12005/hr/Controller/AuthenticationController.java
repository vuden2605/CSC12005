package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.LoginRequest;
import com.csc12005.hr.DTO.Request.LogoutRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.AuthenticationResponse;
import com.csc12005.hr.Service.AuthenticationService.IAuthenticationService;
import com.csc12005.hr.Service.AuthenticationService.impl.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Slf4j
public class AuthenticationController {
	private final IAuthenticationService authenticationService;

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<AuthenticationResponse>> login(@RequestBody @Valid LoginRequest loginRequest) {
		AuthenticationResponse authResponse = authenticationService.login(loginRequest);
		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, buildRefreshTokenCookie(authResponse.getRefreshToken()).toString())
				.body(ApiResponse.<AuthenticationResponse>builder()
						.message("Login successfully")
						.data(authResponse)
						.build()
				);
	}

	@PostMapping("/refresh-token")
	public ResponseEntity<ApiResponse<AuthenticationResponse>> refreshToken(@CookieValue(value = "refreshToken", required = true) String refreshToken) {
		log.info("Refresh token received: {}", refreshToken);
		AuthenticationResponse authResponse;
		try {
			authResponse = authenticationService.refreshToken(refreshToken);
		}
		catch(Exception e) {
			log.info("Error refreshing token: {}", e.getMessage());
			throw e;
		}
		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, buildRefreshTokenCookie(authResponse.getRefreshToken()).toString())
				.body(ApiResponse.<AuthenticationResponse>builder()
						.message("Access token refreshed successfully")
						.data(authResponse)
						.build()
				);
	}

	@PostMapping("/logout")
	public ResponseEntity<ApiResponse<String>> logout(@Valid @RequestBody LogoutRequest logoutRequest) {
		authenticationService.logout(logoutRequest);
		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, deleteRefreshTokenCookie().toString())
				.body(ApiResponse.<String>builder()
						.message("Logout successful")
						.data("Logged out")
						.build()
				);
	}
	private ResponseCookie buildRefreshTokenCookie(String refreshToken) {
		return ResponseCookie.from("refreshToken", refreshToken)
				.httpOnly(true)
				.secure(true)
				.path("/")
				.sameSite("Lax")
				.maxAge(7 * 24 * 60 * 60)
				.build();
	}
	private ResponseCookie deleteRefreshTokenCookie() {
		return ResponseCookie.from("refreshToken", "")
				.httpOnly(true)
				.secure(false)
				.path("/")
				.sameSite("Lax")
				.maxAge(0)
				.build();
	}
}


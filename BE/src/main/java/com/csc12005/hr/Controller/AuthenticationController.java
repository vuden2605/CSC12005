package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.LoginRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.AuthenticationResponse;
import com.csc12005.hr.Service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {
	private final AuthenticationService authenticationService;
	@PostMapping("/auth/login")
	public ApiResponse<AuthenticationResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
		return ApiResponse.<AuthenticationResponse>builder()
				.message("Login successful")
				.data(authenticationService.login(loginRequest))
				.build();
	}
}

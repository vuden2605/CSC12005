package com.csc12005.hr.Service;

import com.csc12005.hr.DTO.Request.LoginRequest;
import com.csc12005.hr.DTO.Response.AuthenticationResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	private final EmployeeRepository employeeRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	public AuthenticationResponse login(LoginRequest loginRequest) {
		Employee employee = employeeRepository.findByEmployeeCode(loginRequest.getUsername())
				.orElseThrow(() -> new AppException(ErrorCode.USERNAME_NOT_FOUND));
		if(!passwordEncoder.matches(loginRequest.getPassword(), employee.getPassword())) {
			throw new AppException(ErrorCode.INVALID_PASSWORD);
		}
		String accessToken = jwtService.generateAccessToken(employee);
		String refreshToken = jwtService.generateRefreshToken(employee);
		return AuthenticationResponse.builder()
				.accessToken(accessToken)
				.refreshToken(refreshToken)
				.isAuthenticated(true)
				.build();

	}
}

package com.csc12005.hr.Service.AuthenticationService.impl;

import com.csc12005.hr.DTO.Request.LoginRequest;
import com.csc12005.hr.DTO.Response.AuthenticationResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Service.AuthenticationService.IAuthenticationService;
import com.csc12005.hr.Service.JwtService.impl.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService implements IAuthenticationService {
	private final EmployeeRepository employeeRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	public AuthenticationResponse login(LoginRequest loginRequest) {
		Employee employee = employeeRepository.findByEmployeeCode(loginRequest.getUsername())
				.orElseThrow(() -> new AppException(ErrorCode.USERNAME_NOT_FOUND));
		if(!passwordEncoder.matches(loginRequest.getPassword(), employee.getPassword())) {
			throw new AppException(ErrorCode.INVALID_PASSWORD);
		}
        if(!employee.getStatus()) throw new AppException(ErrorCode.USER_DISABLED);
		String accessToken = jwtService.generateAccessToken(employee);
		String refreshToken = jwtService.generateRefreshToken(employee);
		return AuthenticationResponse.builder()
				.accessToken(accessToken)
				.refreshToken(refreshToken)
				.isAuthenticated(true)
				.build();
	}
	public AuthenticationResponse refreshAccessToken(String refreshToken) {
		if (refreshToken == null || refreshToken.isEmpty()) {
			throw new AppException(ErrorCode.INVALID_REFRESH_TOKEN);
		}
		Claims claims = jwtService.verifyToken(refreshToken);
		Employee employee = employeeRepository.findById(Long.parseLong(claims.getSubject()))
				.orElseThrow(() -> new AppException(ErrorCode.USERNAME_NOT_FOUND));
		String newAccessToken = jwtService.generateAccessToken(employee);
		return AuthenticationResponse.builder()
				.accessToken(newAccessToken)
				.refreshToken(refreshToken)
				.isAuthenticated(true)
				.build();
	}
}

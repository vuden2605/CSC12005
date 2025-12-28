package com.csc12005.hr.Service.AuthenticationService;

import com.csc12005.hr.DTO.Request.LoginRequest;
import com.csc12005.hr.DTO.Response.AuthenticationResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public interface IAuthenticationService {
	AuthenticationResponse login(LoginRequest loginRequest);
	AuthenticationResponse refreshToken(String refreshToken);

}

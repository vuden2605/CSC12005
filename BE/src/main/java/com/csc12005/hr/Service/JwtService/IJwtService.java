package com.csc12005.hr.Service.JwtService;

import com.csc12005.hr.Entity.Employee;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

@Service
public interface IJwtService {
	String generateAccessToken(Employee employee);
	String generateRefreshToken(Employee employee);
	Claims verifyToken(String token);
	SecretKey getSecretKey();
}

package com.csc12005.hr.Service;

import com.csc12005.hr.Entity.Employee;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
	@Value("${jwt.secret}")
	private String secretKey;
	@Value("${jwt.access-time}")
	private long accessTime;
	@Value("${jwt.refresh-time}")
	private long refreshTime;
	public SecretKey getSecretKey() {
		return Keys.hmacShaKeyFor(secretKey.getBytes());
	}
	public String generateAccessToken(Employee employee) {
		return Jwts.builder()
				.setSubject(employee.getEmployeeCode())
				.claim("scope", employee.getRole())
				.claim("name", employee.getFullName())
				.claim("email", employee.getEmail())
				.claim("type", "access_token")
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + accessTime))
				.signWith(getSecretKey())
				.compact();
	}
	public String generateRefreshToken(Employee employee) {
		return Jwts.builder()
				.setSubject(employee.getEmployeeCode())
				.claim("scope", employee.getRole())
				.claim("name", employee.getFullName())
				.claim("email", employee.getEmail())
				.claim("type", "access_token")
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + refreshTime))
				.signWith(getSecretKey())
				.compact();
	}
	public Claims verifyToken(String token) {
		try {
			return Jwts.parserBuilder()
					.setSigningKey(getSecretKey())
					.build()
					.parseClaimsJws(token)
					.getBody();
		}
		catch (JwtException e) {
			throw new JwtException("Invalid or expired token",e);
		}
	}
}

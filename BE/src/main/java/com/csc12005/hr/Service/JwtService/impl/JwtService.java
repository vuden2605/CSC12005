package com.csc12005.hr.Service.JwtService.impl;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Service.AuthenticationService.ITokenCacheService;
import com.csc12005.hr.Service.JwtService.IJwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtService implements IJwtService {
	@Value("${jwt.secret}")
	private String secretKey;
	@Value("${jwt.access-time}")
	private long accessTime;
	@Value("${jwt.refresh-time}")
	private long refreshTime;
	private final ITokenCacheService tokenCacheService;
	public SecretKey getSecretKey() {
		return Keys.hmacShaKeyFor(secretKey.getBytes());
	}
	public String generateAccessToken(Employee employee) {
		String jti = UUID.randomUUID().toString();
		String rfId = UUID.randomUUID().toString();
		return Jwts.builder()
				.setId(jti)
				.setSubject(employee.getId().toString())
				.claim("scope", employee.getPosition().getRole())
				.claim("name", employee.getFullName())
				.claim("email", employee.getEmail())
				.claim("rfId", rfId)
				.claim("type", "access_token")
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + accessTime))
				.signWith(getSecretKey())
				.compact();
	}
	public String generateRefreshToken(Employee employee) {
		String jti = UUID.randomUUID().toString();
		String acId = UUID.randomUUID().toString();
		return Jwts.builder()
				.setId(jti)
				.setSubject(employee.getId().toString())
				.claim("scope", employee.getPosition().getRole())
				.claim("name", employee.getFullName())
				.claim("email", employee.getEmail())
				.claim("acId", acId)
				.claim("type", "refresh_token")
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + refreshTime))
				.signWith(getSecretKey())
				.compact();
	}
	public Claims verifyToken(String token) {
		try {
			Claims claims = Jwts.parserBuilder()
					.setSigningKey(getSecretKey())
					.build()
					.parseClaimsJws(token)
					.getBody();
			String tokenId = claims.getId();
			if (tokenCacheService.isTokenInvalidated(tokenId)) {
				throw new JwtException("Token has been invalidated");
			}
			return claims;
		}
		catch (JwtException e) {
			throw new JwtException("Invalid or expired token",e);
		}
	}
}

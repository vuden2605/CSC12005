package com.csc12005.hr.Configure;

import com.csc12005.hr.Service.JwtService.IJwtService;
import com.csc12005.hr.Service.JwtService.impl.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

	private final IJwtService jwtService;

	@Override
	public boolean beforeHandshake(
			ServerHttpRequest request,
			ServerHttpResponse response,
			WebSocketHandler wsHandler,
			Map<String, Object> attributes) {

		String token = null;

		// Lấy token từ header
		if (request instanceof ServletServerHttpRequest servletRequest) {
			String authHeader = servletRequest.getServletRequest().getHeader("Authorization");
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				token = authHeader.substring(7);
			}
		}

		// Lấy token từ query param
		if (token == null) {
			URI uri = request.getURI();
			String query = uri.getQuery(); // token=<jwt>
			if (query != null && query.startsWith("token=")) {
				token = query.substring(6);
			}
		}

		if (token != null) {
			Long userId = Long.parseLong(jwtService.verifyToken(token).getSubject());
			attributes.put("userId", userId);
		} else {
			log.warn("No JWT token found for WebSocket connection!");
		}

		return true;
	}


	@Override
	public void afterHandshake(
			ServerHttpRequest request,
			ServerHttpResponse response,
			WebSocketHandler wsHandler,
			Exception exception) {
	}
}

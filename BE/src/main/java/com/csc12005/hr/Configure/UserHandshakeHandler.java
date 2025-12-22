package com.csc12005.hr.Configure;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@Component
@Slf4j
public class UserHandshakeHandler extends DefaultHandshakeHandler {

	@Override
	protected Principal determineUser(
			ServerHttpRequest request,
			WebSocketHandler wsHandler,
			Map<String, Object> attributes) {

		log.info("Determining user for WebSocket connection with attributes: {}", attributes);

		Object userIdObj = attributes.get("userId");
		if (userIdObj == null) {
			log.warn("User ID is missing in WebSocket handshake attributes!");
			return null; // Hoặc trả về một user tạm thời
		}

		Long userId;
		try {
			userId = Long.valueOf(userIdObj.toString());
		} catch (NumberFormatException e) {
			log.error("Invalid userId format: {}", userIdObj);
			return null;
		}

		return userId::toString;
	}

}


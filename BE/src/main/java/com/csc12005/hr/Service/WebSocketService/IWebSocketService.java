package com.csc12005.hr.Service.WebSocketService;

import org.springframework.stereotype.Service;

@Service
public interface IWebSocketService {
	void sendToUser(Long userId, Object payload);
	void sendToAll(Object payload);
}

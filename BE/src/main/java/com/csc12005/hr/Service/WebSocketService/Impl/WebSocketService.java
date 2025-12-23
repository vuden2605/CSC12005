package com.csc12005.hr.Service.WebSocketService.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {

	private final SimpMessagingTemplate messagingTemplate;

	public void sendToUser(Long userId, Object payload) {
		messagingTemplate.convertAndSendToUser(
				userId.toString(),
				"/queue/notifications",
				payload
		);
	}

}


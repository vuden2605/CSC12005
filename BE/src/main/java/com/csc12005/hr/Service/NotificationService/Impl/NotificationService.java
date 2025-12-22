package com.csc12005.hr.Service.NotificationService.Impl;

import com.csc12005.hr.DTO.Request.RequestCreated;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Notification;
import com.csc12005.hr.Enums.NotificationType;
import com.csc12005.hr.Repository.NotificationRepository;
import com.csc12005.hr.Service.NotificationService.INotificationService;
import com.csc12005.hr.Service.WebSocketService.Impl.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.net.http.WebSocket;

@Service
@RequiredArgsConstructor
public class NotificationService implements INotificationService {
	private final NotificationRepository notificationRepository;
	private final WebSocketService webSocketService;

	@Override
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleRequestCreated(RequestCreated requestCreated) {

		Notification notification = Notification.builder()
				.userId(requestCreated.getManagerId())
				.title("Yêu cầu nghỉ phép mới")
				.content(String.format("Nhân viên %s đã tạo một yêu cầu nghỉ phép mới", requestCreated.getEmployeeName()))
				.type(NotificationType.REQUEST)
				.referenceId(requestCreated.getRequestId())
				.build();
		Notification savedNotification = notificationRepository.save(notification);
		webSocketService.sendToUser(requestCreated.getManagerId(), savedNotification);
	}
}

package com.csc12005.hr.Service.NotificationService.Impl;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.LeaveRequestCreated;
import com.csc12005.hr.Entity.Notification;
import com.csc12005.hr.Enums.NotificationType;
import com.csc12005.hr.Repository.NotificationRepository;
import com.csc12005.hr.Service.NotificationService.INotificationService;
import com.csc12005.hr.Service.WebSocketService.Impl.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
@RequiredArgsConstructor
public class NotificationService implements INotificationService {
	private final NotificationRepository notificationRepository;
	private final WebSocketService webSocketService;

	@Override
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleLeaveRequestCreated(LeaveRequestCreated leaveRequestCreated) {

		Notification notification = Notification.builder()
				.userId(leaveRequestCreated.getManagerId())
				.title("Đơn nghỉ phép")
				.content(String.format("Nhân viên %s đã tạo một đơn nghỉ phép mới", leaveRequestCreated.getEmployeeName()))
				.type(NotificationType.REQUEST)
				.referenceId(leaveRequestCreated.getRequestId())
				.build();
		Notification savedNotification = notificationRepository.save(notification);
		webSocketService.sendToUser(leaveRequestCreated.getManagerId(), savedNotification);
	}

	@Override
	public Page<Notification> getNotifications(PageRequestDTO pageRequestDTO) {
		Long userId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
		Pageable pageable = pageRequestDTO.buildPageable();
		return notificationRepository.getNotifications(userId, pageable);
	}

	@Override
	public void markAsRead(Long notificationId) {
		Notification notification = notificationRepository.findById(notificationId)
				.orElseThrow(() -> new RuntimeException("Notification not found"));
		notification.setIsRead(true);
		notificationRepository.save(notification);
	}

	@Override
	public int countUnreadNotifications() {
		Long userId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
		return notificationRepository.countNotificationsUnread(userId);
	}

}

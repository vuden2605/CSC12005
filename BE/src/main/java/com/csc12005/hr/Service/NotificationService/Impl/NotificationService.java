package com.csc12005.hr.Service.NotificationService.Impl;

import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.Entity.Notification;
import com.csc12005.hr.Enums.NotificationType;
import com.csc12005.hr.Repository.NotificationRepository;
import com.csc12005.hr.Service.NotificationService.INotificationService;
import com.csc12005.hr.Service.WebSocketService.Impl.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
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
	private Notification createNotification(Long userId, String title, String content, NotificationType type, Long referenceId) {
		Notification notification = Notification.builder()
				.userId(userId)
				.title(title)
				.content(content)
				.type(type)
				.referenceId(referenceId)
				.build();
		return notificationRepository.save(notification);
	}
	@Override
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleLeaveRequestCreated(LeaveRequestCreated leaveRequestCreated) {
		Notification savedNotification = createNotification(
				leaveRequestCreated.getManagerId(),
				"Đơn nghỉ phép",
				String.format("Nhân viên %s đã gửi đơn xin nghỉ phép. Vui lòng kiểm tra và phê duyệt.", leaveRequestCreated.getEmployeeName()),
				NotificationType.REQUEST,
				leaveRequestCreated.getRequestId()
		);
		webSocketService.sendToUser(leaveRequestCreated.getManagerId(), savedNotification);
	}
	@Override
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleWFHRequestCreated(WFHRequestCreated wfhRequestCreated) {
		Notification savedNotification = createNotification(
				wfhRequestCreated.getManagerId(),
				"Đơn làm việc tại nhà",
				String.format("Nhân viên %s đã gửi đơn xin làm việc tại nhà. Vui lòng kiểm tra và phê duyệt.", wfhRequestCreated.getEmployeeName()),
				NotificationType.REQUEST,
				wfhRequestCreated.getRequestId()
		);
		webSocketService.sendToUser(wfhRequestCreated.getManagerId(), savedNotification);
	}
	@Override
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleTimeSheetRequestCreated(TimeSheetRequestCreated timeSheetRequestCreated) {
		Notification savedNotification = createNotification(
				timeSheetRequestCreated.getManagerId(),
				"Đơn chấm công",
				String.format("Nhân viên %s đã gửi đơn xin chỉnh sửa chấm công. Vui lòng kiểm tra và phê duyệt.", timeSheetRequestCreated.getEmployeeName()),
				NotificationType.REQUEST,
				timeSheetRequestCreated.getRequestId()
		);
		webSocketService.sendToUser(timeSheetRequestCreated.getManagerId(), savedNotification);
	}
	@Override
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleActivityCreated(ActivityCreated activityCreated) {
		Notification savedNotification = createNotification(
				null,
				"Hoạt động mới",
				String.format("Hoạt động %s đã được tạo. Hãy tham gia ngay!", activityCreated.getActivityName()),
				NotificationType.ACTIVITY,
				activityCreated.getActivityId()
		);
		webSocketService.sendToAll(savedNotification);
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

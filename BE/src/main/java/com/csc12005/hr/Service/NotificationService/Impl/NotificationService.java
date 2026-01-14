package com.csc12005.hr.Service.NotificationService.Impl;

import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.Entity.Notification;
import com.csc12005.hr.Enums.NotificationType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Repository.NotificationRepository;
import com.csc12005.hr.Service.NotificationService.INotificationService;
import com.csc12005.hr.Service.WebSocketService.Impl.WebSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
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

	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleLeaveRequestCreated(LeaveRequestCreated leaveRequestCreated) {
		Notification savedNotification = createNotification(
				leaveRequestCreated.getManagerId(),
				"Đơn nghỉ phép",
				String.format("Nhân viên %s đã gửi đơn xin nghỉ phép. Vui lòng kiểm tra và phê duyệt.", leaveRequestCreated.getEmployeeName()),
				NotificationType.REQUEST_CREATED,
				leaveRequestCreated.getRequestId()
		);
		webSocketService.sendToUser(leaveRequestCreated.getManagerId(), savedNotification);
	}

	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleWFHRequestCreated(WFHRequestCreated wfhRequestCreated) {
		log.info("Received WFHRequestCreated event for request id: {}", wfhRequestCreated.getRequestId());
		Notification savedNotification = createNotification(
				wfhRequestCreated.getManagerId(),
				"Đơn làm việc tại nhà",
				String.format("Nhân viên %s đã gửi đơn xin làm việc tại nhà. Vui lòng kiểm tra và phê duyệt.", wfhRequestCreated.getEmployeeName()),
				NotificationType.REQUEST_CREATED,
				wfhRequestCreated.getRequestId()
		);
		webSocketService.sendToUser(wfhRequestCreated.getManagerId(), savedNotification);
	}

	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleTimeSheetRequestCreated(TimeSheetRequestCreated timeSheetRequestCreated) {
		Notification savedNotification = createNotification(
				timeSheetRequestCreated.getManagerId(),
				"Đơn chấm công",
				String.format("Nhân viên %s đã gửi đơn xin chỉnh sửa chấm công. Vui lòng kiểm tra và phê duyệt.", timeSheetRequestCreated.getEmployeeName()),
				NotificationType.REQUEST_CREATED,
				timeSheetRequestCreated.getRequestId()
		);
		webSocketService.sendToUser(timeSheetRequestCreated.getManagerId(), savedNotification);
	}

	@Override
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleRejectRequestEvent(RejectRequestEvent rejectRequestEvent) {
		Notification notification = createNotification(
				rejectRequestEvent.getEmployeeId(),
				"Yêu cầu bị từ chối",
				String.format("Yêu cầu %s của bạn đã bị từ chối. Vui lòng kiểm tra lại.", rejectRequestEvent.getRequestType().getDisplayName()),
				NotificationType.REQUEST_REJECTED,
				rejectRequestEvent.getRequestId()
		);
		webSocketService.sendToUser(rejectRequestEvent.getEmployeeId(), notification);
	}

	@Override
	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleApproveRequestEvent(ApproveRequestEvent approveRequestEvent) {
		Notification notification = createNotification(
				approveRequestEvent.getEmployeeId(),
				"Yêu cầu được duyệt",
				String.format("Yêu cầu %s của bạn đã được duyệt.", approveRequestEvent.getRequestType().getDisplayName()),
				NotificationType.REQUEST_APPROVED,
				approveRequestEvent.getRequestId()
		);
		webSocketService.sendToUser(approveRequestEvent.getEmployeeId(), notification);
	}

	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleScheduleCreated(ScheduleCreated scheduleCreated) {
		Notification notification = createNotification(
				scheduleCreated.getManagerId(),
				"Lịch phỏng vấn mới",
				String.format("Bạn có một lịch phỏng vấn mới, nhấn vào để xem chi tiết."),
				NotificationType.SCHEDULE,
				scheduleCreated.getId()
		);
		webSocketService.sendToUser(scheduleCreated.getManagerId(), notification);
	}


	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleScheduleUpdated(ScheduleUpdated scheduleUpdated) {
		Notification notification = createNotification(
				scheduleUpdated.getManagerId(),
				"Cập nhật lịch phỏng vấn",
				String.format("Lịch phỏng vấn của bạn vào ngày %s đã được cập nhật, nhấn để xem ngay.", scheduleUpdated.getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))),
				NotificationType.SCHEDULE,
				scheduleUpdated.getId()
		);
		webSocketService.sendToUser(scheduleUpdated.getManagerId(), notification);
	}


	@Async
	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	public void handleScheduleDeleted(ScheduleDeleted scheduleDeleted) {
		Notification notification = createNotification(
				scheduleDeleted.getManagerId(),
				"Lịch phỏng vấn đã bị hủy",
				String.format("Lịch phỏng vấn của bạn vào ngày %s đã bị hủy, nhấn để xem ngay.", scheduleDeleted.getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))),
				NotificationType.SCHEDULE,
				scheduleDeleted.getId()
		);
		webSocketService.sendToUser(scheduleDeleted.getManagerId(), notification);
	}


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
				.orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
		notification.setIsRead(true);
		notificationRepository.save(notification);
	}

	@Override
	public int countUnreadNotifications() {
		Long userId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
		return notificationRepository.countNotificationsUnread(userId);
	}


}

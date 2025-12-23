package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.Entity.Notification;
import com.csc12005.hr.Service.NotificationService.INotificationService;
import com.csc12005.hr.Service.NotificationService.Impl.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotificationController {
	private final INotificationService notificationService;

	@GetMapping
	public ApiResponse<Page<Notification>> getNotifications(PageRequestDTO pageRequestDTO) {
		return ApiResponse.<Page<Notification>>builder()
				.message("Notifications retrieved successfully")
				.data(notificationService.getNotifications(pageRequestDTO))
				.build();
	}
	@PutMapping("/{notificationId}/read")
	public ApiResponse<Void> markAsRead(@PathVariable Long notificationId) {
		notificationService.markAsRead(notificationId);
		return ApiResponse.<Void>builder()
				.message("Notification marked as read successfully")
				.build();
	}
	@GetMapping("/unread/count")
	public ApiResponse<Integer> countUnreadNotifications() {
		return ApiResponse.<Integer>builder()
				.message("Unread notifications count retrieved successfully")
				.data(notificationService.countUnreadNotifications())
				.build();
	}
}

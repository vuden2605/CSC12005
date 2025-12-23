package com.csc12005.hr.Service.NotificationService;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.RequestCreated;
import com.csc12005.hr.Entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface INotificationService {
	void handleRequestCreated(RequestCreated requestCreated);
	Page<Notification> getNotifications(PageRequestDTO pageRequestDTO);
	void markAsRead(Long notificationId);
}

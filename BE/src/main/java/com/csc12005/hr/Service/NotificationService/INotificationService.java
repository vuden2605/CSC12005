package com.csc12005.hr.Service.NotificationService;

import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.Entity.Notification;
import org.springframework.data.domain.Page;

public interface INotificationService {
	void handleLeaveRequestCreated(LeaveRequestCreated leaveRequestCreated);
	void handleActivityCreated(ActivityCreated activityCreated);
	void handleWFHRequestCreated(WFHRequestCreated wfhRequestCreated);
	void handleTimeSheetRequestCreated(TimeSheetRequestCreated timeSheetRequestCreated);
	void handleScheduleCreated(ScheduleCreated scheduleCreated);
	void handleScheduleUpdated(ScheduleUpdated scheduleUpdated);
	void handleScheduleDeleted(ScheduleDeleted scheduleDeleted);
	Page<Notification> getNotifications(PageRequestDTO pageRequestDTO);
	void markAsRead(Long notificationId);
	int countUnreadNotifications();
}

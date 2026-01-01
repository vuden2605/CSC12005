package com.csc12005.hr.Enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@AllArgsConstructor
@Getter
public enum  ActivityStatus {
	DRAFT("Nháp"),
	OPEN_FOR_REGISTRATION("Đang mở đăng ký"),
	REGISTRATION_CLOSED("Đã đóng đăng ký"),
	ONGOING("Đang diễn ra"),
	COMPLETED("Đã hoàn thành"),
	CANCELLED("Đã hủy");
	private final String displayName;
}

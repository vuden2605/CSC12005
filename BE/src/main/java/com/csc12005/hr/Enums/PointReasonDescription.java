package com.csc12005.hr.Enums;

public enum PointReasonDescription {
	MONTHLY_GRANT("Cấp điểm hàng tháng"),
	EXCHANGE("Đổi điểm"),
	ACTIVITY_BONUS("Thưởng hoạt động"),
	ACTIVITY_PENALTY("Phạt hoạt động"),
	ADMIN_ADJUSTMENT("Điều chỉnh bởi quản trị");

	private final String description;

	PointReasonDescription(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}
}


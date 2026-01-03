package com.csc12005.hr.Enums;

import lombok.Getter;

@Getter
public enum HolidayType {
	FIXED_DATE("Ngày lễ cố định"),
	LUNAR_DATE("Ngày lễ âm lịch"),
	COMPENSATORY("Nghỉ bù"),
	FLOATING("Ngày lễ di động"),
	REGIONAL("Ngày lễ vùng miền");

	private final String displayName;

	HolidayType(String displayName) {
		this.displayName = displayName;
	}

}

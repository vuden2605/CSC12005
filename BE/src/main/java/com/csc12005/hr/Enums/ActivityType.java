package com.csc12005.hr.Enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ActivityType {
	SPORTS("Thể thao"),
	CULTURE("Văn hóa - Văn nghệ"),
	VOLUNTEER("Tình nguyện"),
	TRAINING("Đào tạo"),
	TEAM_BUILDING("Team Building"),
	CONFERENCE("Hội thảo"),
	COMPETITION("Thi đấu"),
	WORKSHOP("Workshop"),
	SEMINAR("Seminar"),
	OTHER("Khác");

	private final String displayName;

}

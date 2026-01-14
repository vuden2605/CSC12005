package com.csc12005.hr.Enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RequestType{
	TimeSheet("chỉnh sửa chấm công"),
	Leave("nghỉ phép"),
	WorkFromHome("làm việc tại nhà");

	private final String displayName;
}

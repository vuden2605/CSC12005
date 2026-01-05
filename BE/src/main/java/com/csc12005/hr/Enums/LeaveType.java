package com.csc12005.hr.Enums;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum LeaveType {
	SICK_LEAVE("Nghỉ ốm"),
	ANNUAL_LEAVE("Nghỉ phép"),
	MATERNITY_LEAVE("Nghỉ thai sản"),
	PERSONAL_LEAVE("Nghỉ việc riêng");
	private final String displayName;
}

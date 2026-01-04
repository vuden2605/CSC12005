package com.csc12005.hr.DTO.Request;
import lombok.Data;
@Data
public class HolidayFilterRequest {
	private String holidayName;
	private Integer year;
	private Integer month;
}

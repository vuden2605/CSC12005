package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Enums.TimeSheetStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class TimeSheetResponse {
	private Long timesheetId;
	private LocalDate workDate;
	private LocalTime checkIn;
	private LocalTime checkOut;
	private TimeSheetStatus status;
	private EmployeeResponse employee;
}

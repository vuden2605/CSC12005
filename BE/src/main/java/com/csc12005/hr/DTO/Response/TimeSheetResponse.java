package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Enums.TimeSheetStatus;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class TimeSheetResponse {
	private Long id;
	private LocalDate workDate;
	private LocalTime checkIn;
	private LocalTime checkOut;
	private TimeSheetStatus status;
	private EmployeeResponse employee;
}

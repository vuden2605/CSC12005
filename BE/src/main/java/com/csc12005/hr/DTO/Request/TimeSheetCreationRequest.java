package com.csc12005.hr.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSheetCreationRequest {
	private LocalDate workDate;
	private LocalTime checkIn;
	private LocalTime checkOut;
}

package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.PointExchangeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PointExchangeFilterRequest {
	private PointExchangeStatus status;
	private String employeeName;
	private String employeeCode;
	private LocalDateTime startDate;
	private LocalDateTime endDate;
}

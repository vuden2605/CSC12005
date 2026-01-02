package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Enums.TimeSheetType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TimeSheetResponse {
	private Long id;
	private LocalDate workDate;
	private LocalTime checkIn;
	private LocalTime checkOut;
	private TimeSheetType type;
	private String employeeName;
	private String employeeCode;
	private String departmentName;
	private String positionName;
	private BigDecimal workHours;
	private Integer lateMinutes;
	private Boolean isAdjusted;
	private String adjustmentReason;
	private Boolean isWorkOnHoliday = false;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private String employeeNameCreated;
	private String employeeCodeCreated;
	private String employeeNameUpdated;
	private String employeeCodeUpdated;
	private RequestResponse request;
}

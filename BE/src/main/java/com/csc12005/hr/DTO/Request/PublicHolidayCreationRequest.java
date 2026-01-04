package com.csc12005.hr.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicHolidayCreationRequest {

	private String holidayName;

	private LocalDate holidayDate;

	private Integer year;

	private Integer month;

	private String description;
}

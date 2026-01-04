package com.csc12005.hr.DTO.Response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PublicHolidayResponse {
	private Long id;

	private String holidayName;

	private String holidayDate;

	private Integer year;

	private Integer month;

	private String description;
}

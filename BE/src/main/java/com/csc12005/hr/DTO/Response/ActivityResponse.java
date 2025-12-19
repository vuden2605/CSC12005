package com.csc12005.hr.DTO.Response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ActivityResponse {
	private Long id;
	private String activityName;
	private String description;
	private LocalDate startDate;
	private LocalDate endDate;
    private Long count;
    private Long registeredCount;
	private Long points;
}

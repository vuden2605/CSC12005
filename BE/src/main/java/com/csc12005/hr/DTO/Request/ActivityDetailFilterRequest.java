package com.csc12005.hr.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDetailFilterRequest {
	private String activityName;
	private LocalDate startDate;
	private LocalDate endDate;
	private boolean isSuccess;
}

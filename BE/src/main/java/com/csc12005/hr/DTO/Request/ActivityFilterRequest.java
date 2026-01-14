package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.ActivityStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityFilterRequest {
	private String activityName;
	private LocalDate startDate;
    private ActivityStatus activityStatus;
	private LocalDate endDate;
}

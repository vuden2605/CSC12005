package com.csc12005.hr.DTO.Response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ActivityDetailResponse {
	private ActivityResponse activity;
	private Boolean isRegistered;
	private Boolean isSuccess;
	private Long score;
}

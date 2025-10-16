package com.csc12005.hr.DTO.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PositionResponse {
	private String positionName;
	private String positionCode;
	private Long salaryRangeMin;
	private Long salaryRangeMax;
	private Long baseWorkTimes;
	private Long point;
}

package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.PointReasonType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PointHistoryFilterRequest {
	private PointReasonType type;
	private Integer year;
	private Integer month;
}

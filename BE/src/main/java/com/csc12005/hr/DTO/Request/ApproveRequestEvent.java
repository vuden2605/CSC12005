package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Enums.RequestType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApproveRequestEvent {
	private Long requestId;
	private Long employeeId;
	private RequestType requestType;
}

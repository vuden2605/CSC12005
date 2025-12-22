package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Entity.Employee;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestCreated {
	private Long requestId;
	private Long managerId;
	private String employeeName;
}

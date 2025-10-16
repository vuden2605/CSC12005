package com.csc12005.hr.DTO.Request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentCreationRequest {
	private String departmentName;
	private String departmentCode;
}

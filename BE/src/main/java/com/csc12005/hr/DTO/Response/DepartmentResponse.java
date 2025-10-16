package com.csc12005.hr.DTO.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentResponse {
	private String departmentName;
	private String departmentCode;
}

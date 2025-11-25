package com.csc12005.hr.DTO.Response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentResponse {
	private Long id;
	private String departmentName;
	private String departmentCode;
}

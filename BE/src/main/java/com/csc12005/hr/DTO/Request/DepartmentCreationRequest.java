package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentCreationRequest {
	@NotBlank(message = "REQUIRED_DEPARTMENT_NAME")
	private String departmentName;
	@NotBlank(message = "REQUIRED_DEPARTMENT_CODE")
	private String departmentCode;
}

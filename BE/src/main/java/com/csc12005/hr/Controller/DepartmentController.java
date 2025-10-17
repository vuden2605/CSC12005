package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.DepartmentCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.DepartmentResponse;
import com.csc12005.hr.Service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DepartmentController {
	private final DepartmentService departmentService;
	@PostMapping("/departments")
	public ApiResponse<DepartmentResponse> createDepartment(@RequestBody DepartmentCreationRequest departmentCreationRequest) {
		return ApiResponse.<DepartmentResponse>builder()
				.message("Department created successfully")
				.code(201)
				.data(departmentService.createDepartment(departmentCreationRequest))
				.build();
	}
}

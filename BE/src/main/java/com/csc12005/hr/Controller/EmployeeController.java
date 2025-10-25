package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.Service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class EmployeeController {
	private final EmployeeService employeeService;
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping("/employees")
	public ApiResponse<EmployeeResponse> createEmployee(@RequestBody @Valid EmployeeCreationRequest employeeCreationRequest) {
		return ApiResponse.<EmployeeResponse>builder()
				.message("Employee created successfully")
				.data(employeeService.createEmployee(employeeCreationRequest))
				.build();
	}
}

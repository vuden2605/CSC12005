package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.Service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class EmployeeController {
	private final EmployeeService employeeService;
	@PostMapping("/employees")
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<EmployeeResponse> createEmployee(@RequestBody @Valid EmployeeCreationRequest employeeCreationRequest) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		log.info("User '{}' is creating a new employee", authentication.getName());
		return ApiResponse.<EmployeeResponse>builder()
				.message("Employee created successfully")
				.data(employeeService.createEmployee(employeeCreationRequest))
				.build();
	}
}

package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Request.EmployeeUpdateRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.Service.impl.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/employees")
public class EmployeeController {
	private final EmployeeService employeeService;
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<EmployeeResponse> createEmployee(@RequestBody @Valid EmployeeCreationRequest employeeCreationRequest) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		log.info("User '{}' is creating a new employee", authentication.getName());
		return ApiResponse.<EmployeeResponse>builder()
				.message("Employee created successfully")
				.data(employeeService.createEmployee(employeeCreationRequest))
				.build();
	}
    @GetMapping("/profile")
    public ApiResponse<EmployeeResponse> myInfo(){
        return ApiResponse.<EmployeeResponse>builder()
                .data(employeeService.getMyInfo())
                .build();
    }
    @PatchMapping
    public ApiResponse<EmployeeResponse> updateEmployee(@RequestBody @Valid EmployeeUpdateRequest request){
        return ApiResponse.<EmployeeResponse>builder()
                .message("Employee update successfully")
                .data(employeeService.updateUser(request))
                .build();
    }

}

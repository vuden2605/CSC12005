package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Request.EmployeeUpdateRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.EmployeeListItemResponse;
import com.csc12005.hr.DTO.Request.DeactivateEmployeeRequest;
import com.csc12005.hr.Service.EmployeeService.impl.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/employees")
public class EmployeeController {
	private final EmployeeService employeeService;
	@PostMapping
	@PreAuthorize("hasRole('ADMIN') OR hasRole('HR')")
	public ApiResponse<EmployeeResponse> createEmployee(@RequestBody @Valid EmployeeCreationRequest employeeCreationRequest) {
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
    @GetMapping
    @PreAuthorize("hasRole('HR')") 
    public ApiResponse<List<EmployeeListItemResponse>> getEmployeesForHr(
            @RequestParam(value = "status", required = false) Boolean status
    ) {
        return ApiResponse.<List<EmployeeListItemResponse>>builder()
                .message("Get employees successfully")
                .data(employeeService.getEmployeesForHr(status))
                .build();
    }


    // HR ADMIN - VÔ HIỆU HÓA NHÂN VIÊN

    @PutMapping("/deactivate")
    @PreAuthorize("hasRole('HR')")
    public ApiResponse<Void> deactivateEmployee(@RequestBody @Valid DeactivateEmployeeRequest request) {
        employeeService.deactivateEmployeeForHr(request.employeeId);
        return ApiResponse.<Void>builder()
                .message("Employee deactivated successfully")
                .build();
    }

}

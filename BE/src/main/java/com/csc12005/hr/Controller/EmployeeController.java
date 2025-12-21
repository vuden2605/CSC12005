package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Request.EmployeeHRUpdateRequest;
import com.csc12005.hr.DTO.Request.EmployeeUpdateRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.ImportResult;
import com.csc12005.hr.Service.EmployeeService.impl.EmployeeService;
import com.csc12005.hr.Service.EmployeeService.impl.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/employees")
public class EmployeeController {
	private final EmployeeService employeeService;
	@PostMapping
//	@PreAuthorize("hasRole('ADMIN') OR hasRole('HR')")
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
    @GetMapping("/department/{departmentId}")
	public ApiResponse<Page<EmployeeResponse>> getEmployeeByDepartment(
		    @PathVariable Long departmentId,
		    PageRequestDTO pageRequestDTO) {

		return ApiResponse.<Page<EmployeeResponse>>builder()
				.message("Get employees by department successfully")
				.data(employeeService.getEmployeesByDepartment(departmentId, pageRequestDTO))
				.build();
    }
    @GetMapping("/by-manager/{managerId}")
	public ApiResponse<Page<EmployeeResponse>> getEmployeeByManager(
		    @PathVariable Long managerId,
		    PageRequestDTO pageRequestDTO) {
		return ApiResponse.<Page<EmployeeResponse>>builder()
				.message("Get employees by manager successfully")
				.data(employeeService.getEmployeesByManager(managerId, pageRequestDTO))
				.build();
    }
    @PatchMapping
    public ApiResponse<EmployeeResponse> updateEmployee(@RequestBody @Valid EmployeeUpdateRequest request){
        return ApiResponse.<EmployeeResponse>builder()
                .message("Employee update successfully")
                .data(employeeService.updateUser(request))
                .build();
    }
    @PatchMapping("/{id}")
    public ApiResponse<EmployeeResponse> hrUpdateEmployee(@RequestBody @Valid EmployeeHRUpdateRequest request,@PathVariable Long id){
        return ApiResponse.<EmployeeResponse> builder()
                .message("HR update employee success")
                .data(employeeService.hrUpdateEmployee(request,id))
                .build();
    }
    @PatchMapping("/status/{id}")
    public ApiResponse<EmployeeResponse> updateStatus(@PathVariable Long id){
        return ApiResponse.<EmployeeResponse> builder()
                .message("Disable success")
                .data(employeeService.updateStatus(id))
                .build();

    }
    @GetMapping()
    public ApiResponse<List<EmployeeResponse>> getAllEmp() {
        return ApiResponse.<List<EmployeeResponse>>builder()
                .message("get all emp")
                .data(employeeService.getAll())
                .build();
    }
    @PostMapping("/import" )
	public ApiResponse<ImportResult> importEmployees(@RequestParam ("file") MultipartFile file) {
		return ApiResponse.<ImportResult>builder()
				.message("Import employees successfully")
				.data(employeeService.importExcel(file))
				.build();
	}
}

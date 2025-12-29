package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.ProjectCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.ProjectResponse;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Service.ProjectService.Impl.ProjectService;
import com.csc12005.hr.Utils.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects")
public class ProjectController {
	private final ProjectService projectService;
	private final SecurityUtils securityUtils;
	@PreAuthorize("hasRole('ADMIN') or hasRole('CEO')")
	@PostMapping
	public ApiResponse<ProjectResponse> createProject(@RequestBody @Valid ProjectCreationRequest request) {
		return ApiResponse.<ProjectResponse>builder()
				.message("Project created successfully")
				.data(projectService.createProject(request))
				.build();
	}
	@PreAuthorize("hasRole('ADMIN') or hasRole('CEO')")
	@GetMapping
	public ApiResponse<Page<ProjectResponse>> getAllProjects(PageRequestDTO pageRequestDTO) {
		return ApiResponse.<Page<ProjectResponse>>builder()
				.message("Get all projects successfully")
				.data(projectService.getAllProjects(pageRequestDTO))
				.build();
	}
	@GetMapping("/department/{departmentId}")
	public ApiResponse<Page<ProjectResponse>> getProjectsByDepartment(
			@PathVariable Long departmentId,
			PageRequestDTO pageRequestDTO) {
		return ApiResponse.<Page<ProjectResponse>>builder()
				.message("Get projects by department successfully")
				.data(projectService.getProjectsByDepartment(departmentId, pageRequestDTO))
				.build();
	}
	@GetMapping("/my-projects")
	public ApiResponse<Page<ProjectResponse>> getMyProjects(
			PageRequestDTO pageRequestDTO) {
		Long userId = securityUtils.getCurrentUserId();
		return ApiResponse.<Page<ProjectResponse>>builder()
				.message("Get my projects successfully")
				.data(projectService.getMyProjects(userId, pageRequestDTO))
				.build();
	}


}

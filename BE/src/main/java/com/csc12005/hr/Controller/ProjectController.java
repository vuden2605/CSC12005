package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.ProjectCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.ProjectResponse;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Service.ProjectService.Impl.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProjectController {
	private final ProjectService projectService;
	@PreAuthorize("hasRole('ADMIN') or hasRole('MN')")
	@PostMapping("/projects")
	public ApiResponse<ProjectResponse> createProject(@RequestBody @Valid ProjectCreationRequest request) {
		return ApiResponse.<ProjectResponse>builder()
				.message("Project created successfully")
				.data(projectService.createProject(request))
				.build();
	}
	@PreAuthorize("hasRole('ADMIN') or hasRole('MN')")
	@GetMapping("/projects")
	public ApiResponse<Page<ProjectResponse>> getAllProjects(PageRequestDTO pageRequestDTO) {
		return ApiResponse.<Page<ProjectResponse>>builder()
				.message("Get all projects successfully")
				.data(projectService.getAllProjects(pageRequestDTO))
				.build();
	}

}

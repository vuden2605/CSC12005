package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.ProjectMemberCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.ProjectMemberResponse;
import com.csc12005.hr.Service.ProjectMemberService.Impl.ProjectMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/project-members")
public class ProjectMemberController {
	private final ProjectMemberService projectMemberService;
	@PostMapping("/by-project/{projectId}")
	public ApiResponse<List<ProjectMemberResponse>> createProjectMember(
			@PathVariable("projectId") Long projectId,
			@RequestBody @Valid List<ProjectMemberCreationRequest> requests) {
		return ApiResponse.<List<ProjectMemberResponse>>builder()
				.message("Create project member successfully")
				.data(projectMemberService.createProjectMember(projectId, requests))
				.build();
	}
}

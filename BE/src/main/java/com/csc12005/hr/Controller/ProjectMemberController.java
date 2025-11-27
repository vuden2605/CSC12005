package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.ProjectMemberCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.ProjectMemberResponse;
import com.csc12005.hr.Service.ProjectMemberService.Impl.ProjectMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProjectMemberController {
	private final ProjectMemberService projectMemberService;
	@PostMapping("/project-member" )
	public ApiResponse<ProjectMemberResponse> createProjectMember(@RequestBody @Valid ProjectMemberCreationRequest request) {
		return ApiResponse.<ProjectMemberResponse>builder()
				.message("Create project member successfully")
				.data(projectMemberService.createProjectMember(request))
				.build();
	}
}

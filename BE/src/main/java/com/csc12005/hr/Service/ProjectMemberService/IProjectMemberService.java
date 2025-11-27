package com.csc12005.hr.Service.ProjectMemberService;

import com.csc12005.hr.DTO.Request.ProjectMemberCreationRequest;
import com.csc12005.hr.DTO.Response.ProjectMemberResponse;
import org.springframework.stereotype.Service;

@Service
public interface IProjectMemberService {
	ProjectMemberResponse createProjectMember(ProjectMemberCreationRequest projectMemberCreationRequest);
}

package com.csc12005.hr.Service.ProjectMemberService;

import com.csc12005.hr.DTO.Request.ProjectMemberCreationRequest;
import com.csc12005.hr.DTO.Response.ProjectMemberResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IProjectMemberService {
	List<ProjectMemberResponse> createProjectMember(Long projectId, List<ProjectMemberCreationRequest> requests);
}

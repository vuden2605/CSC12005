package com.csc12005.hr.Service.ProjectService;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.ProjectCreationRequest;
import com.csc12005.hr.DTO.Response.ProjectResponse;
import com.csc12005.hr.Entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface IProjectService {
	ProjectResponse createProject(ProjectCreationRequest projectCreationRequest);
	Page<ProjectResponse> getAllProjects(PageRequestDTO pageRequestDTO);
}

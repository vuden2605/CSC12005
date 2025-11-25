package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.ProjectCreationRequest;
import com.csc12005.hr.DTO.Response.ProjectResponse;
import com.csc12005.hr.Entity.Project;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
	Project toProject(ProjectCreationRequest projectCreationRequest);
	ProjectResponse toProjectResponse(Project project);
}

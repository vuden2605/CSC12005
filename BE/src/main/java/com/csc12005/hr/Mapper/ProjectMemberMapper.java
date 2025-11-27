package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.ProjectMemberCreationRequest;
import com.csc12005.hr.DTO.Response.ProjectMemberResponse;
import com.csc12005.hr.Entity.Project;
import com.csc12005.hr.Entity.ProjectMember;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProjectMemberMapper {
	ProjectMember toProjectMember(ProjectMemberCreationRequest projectMemberCreationRequest);
	ProjectMemberResponse toProjectMemberResponse(ProjectMember projectMember);
}

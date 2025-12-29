package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.ProjectMemberCreationRequest;
import com.csc12005.hr.DTO.Response.ProjectMemberResponse;
import com.csc12005.hr.Entity.Project;
import com.csc12005.hr.Entity.ProjectMember;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectMemberMapper {
	ProjectMember toProjectMember(ProjectMemberCreationRequest projectMemberCreationRequest);
	@Mapping(source = "employee.id", target = "employeeId")
	@Mapping(source = "employee.fullName", target = "employeeName")
	@Mapping(source = "employee.employeeCode", target = "employeeCode")
	ProjectMemberResponse toProjectMemberResponse(ProjectMember projectMember);
}

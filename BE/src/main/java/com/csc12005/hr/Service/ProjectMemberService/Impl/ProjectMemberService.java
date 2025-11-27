package com.csc12005.hr.Service.ProjectMemberService.Impl;

import com.csc12005.hr.DTO.Request.ProjectCreationRequest;
import com.csc12005.hr.DTO.Request.ProjectMemberCreationRequest;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.ProjectMemberResponse;
import com.csc12005.hr.DTO.Response.ProjectResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Project;
import com.csc12005.hr.Entity.ProjectMember;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.ProjectMemberMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.ProjectMemberRepository;
import com.csc12005.hr.Repository.ProjectRepository;
import com.csc12005.hr.Service.ProjectMemberService.IProjectMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectMemberService implements IProjectMemberService {
	private final ProjectMemberRepository projectMemberRepository;
	private final ProjectMemberMapper projectMemberMapper;
	private final EmployeeRepository employeeRepository;
	private final ProjectRepository projectRepository;
	@Override
	public ProjectMemberResponse createProjectMember(ProjectMemberCreationRequest projectMemberCreationRequest) {
		Employee employee = employeeRepository.findById(projectMemberCreationRequest.getEmployeeId())
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		Project project = projectRepository.findById(projectMemberCreationRequest.getProjectId())
				.orElseThrow(() -> new AppException(ErrorCode.PROJECT_NOT_FOUND));
		ProjectMember projectMember = projectMemberMapper.toProjectMember(projectMemberCreationRequest);
		projectMember.setEmployee(employee);
		projectMember.setProject(project);
		return projectMemberMapper.toProjectMemberResponse(projectMemberRepository.save(projectMember));
	}
}

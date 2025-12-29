package com.csc12005.hr.Service.ProjectMemberService.Impl;

import com.csc12005.hr.DTO.Request.ProjectCreationRequest;
import com.csc12005.hr.DTO.Request.ProjectMemberCreationRequest;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.ProjectMemberResponse;
import com.csc12005.hr.DTO.Response.ProjectResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Project;
import com.csc12005.hr.Entity.ProjectMember;
import com.csc12005.hr.Enums.ProjectMemberRole;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.ProjectMemberMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.ProjectMemberRepository;
import com.csc12005.hr.Repository.ProjectRepository;
import com.csc12005.hr.Service.ProjectMemberService.IProjectMemberService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectMemberService implements IProjectMemberService {
	private final ProjectMemberRepository projectMemberRepository;
	private final ProjectMemberMapper projectMemberMapper;
	private final EmployeeRepository employeeRepository;
	private final ProjectRepository projectRepository;
	@Transactional
	@Override
	public List<ProjectMemberResponse> createProjectMember(Long projectId, List<ProjectMemberCreationRequest> requests) {
		List<Long> employeeIds = requests.stream()
				.map(ProjectMemberCreationRequest::getEmployeeId)
				.toList();
		List<Employee> employee = employeeRepository.findAllById(employeeIds);
		if(employee.size() != employeeIds.size()) {
			throw new AppException(ErrorCode.EMPLOYEE_NOT_FOUND);
		}
		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new AppException(ErrorCode.PROJECT_NOT_FOUND));
		Map<Long, ProjectMemberRole> roleMap = requests.stream()
				.collect(Collectors.toMap(
						ProjectMemberCreationRequest::getEmployeeId,
						ProjectMemberCreationRequest::getRole
				));
		List<ProjectMember> projectMembers = employee.stream()
				.map(emp -> {
					return ProjectMember.builder()
							.employee(emp)
							.project(project)
							.role(roleMap.get(emp.getId()))
							.build();
				}).toList();
		List<ProjectMember> savedProjectMembers = projectMemberRepository.saveAll(projectMembers);
		return savedProjectMembers.stream().map(projectMemberMapper::toProjectMemberResponse).collect(Collectors.toList());

	}
}

package com.csc12005.hr.Service.ProjectAuthService.Impl;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Project;
import com.csc12005.hr.Entity.ProjectMember;
import com.csc12005.hr.Enums.EmployeeRole;
import com.csc12005.hr.Enums.ProjectMemberRole;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.ProjectMemberRepository;
import com.csc12005.hr.Repository.ProjectRepository;
import com.csc12005.hr.Service.ProjectAuthService.IProjectAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class ProjectAuthService implements IProjectAuthService {
	private final EmployeeRepository employeeRepository;
	private final ProjectRepository projectRepository;
	private final ProjectMemberRepository projectMemberRepository;
	@Override
	public boolean canCreateTask(Long projectId, String username) {
		Long employeeId = Long.parseLong(username);
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		if(Arrays.asList(EmployeeRole.ADMIN,EmployeeRole.CEO).contains(employee.getPosition().getRole())) {
			return true;
		}
		if(EmployeeRole.MN.equals(employee.getPosition().getRole())) {
			Project project = projectRepository.findById(projectId)
					.orElseThrow(() -> new AppException(ErrorCode.PROJECT_NOT_FOUND));
			if (project.getDepartment().getId().equals(employee.getDepartment().getId())) {
				return true;
			}
		}
		return isProjectLeader(projectId, employeeId);
	}
	private boolean isProjectLeader(Long projectId, Long employeeId) {
		return projectMemberRepository.existsByProjectIdAndEmployeeIdAndRole(projectId, employeeId, ProjectMemberRole.LEAD);
	}

}

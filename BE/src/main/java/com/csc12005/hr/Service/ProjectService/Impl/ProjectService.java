package com.csc12005.hr.Service.ProjectService.Impl;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.ProjectCreationRequest;
import com.csc12005.hr.DTO.Response.ProjectResponse;
import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity.Project;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.ProjectMapper;
import com.csc12005.hr.Repository.DepartmentRepository;
import com.csc12005.hr.Repository.ProjectRepository;
import com.csc12005.hr.Service.ProjectService.IProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectService implements IProjectService {
	private final ProjectRepository projectRepository;
	private final DepartmentRepository departmentRepository;
	private final ProjectMapper projectMapper;
	@Override
	public ProjectResponse createProject(ProjectCreationRequest projectCreationRequest) {
		Department department = departmentRepository.findById(projectCreationRequest.getDepartmentId())
				.orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
		Project project = projectMapper.toProject(projectCreationRequest);
		project.setDepartment(department);
		return projectMapper.toProjectResponse(projectRepository.save(project));
	}

	@Override
	public Page<ProjectResponse> getAllProjects(PageRequestDTO pageRequestDTO) {
		Pageable pageable = pageRequestDTO.buildPageable();
		return projectRepository.findAll(pageable).map(projectMapper::toProjectResponse);
	}
	public Page<ProjectResponse> getProjectsByDepartment(Long departmentId, PageRequestDTO pageRequestDTO) {
		Department department = departmentRepository.findById(departmentId)
				.orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
		Pageable pageable = pageRequestDTO.buildPageable();
		return projectRepository.findByDepartmentId(departmentId, pageable).map(projectMapper::toProjectResponse);
	}
	public Page<ProjectResponse> getMyProjects(Long userId, PageRequestDTO pageRequestDTO) {
		Pageable pageable = pageRequestDTO.buildPageable();
		return projectRepository.getMyProjects(userId, pageable).map(projectMapper::toProjectResponse);
	}
}

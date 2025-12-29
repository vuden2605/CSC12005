package com.csc12005.hr.Service.TaskService.Impl;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.TaskCreationRequest;
import com.csc12005.hr.DTO.Request.TaskFilterRequest;
import com.csc12005.hr.DTO.Request.UpdateTaskRequest;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.TaskResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Project;
import com.csc12005.hr.Entity.Task;
import com.csc12005.hr.Enums.EmployeeRole;
import com.csc12005.hr.Enums.TaskStatus;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.TaskMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.ProjectRepository;
import com.csc12005.hr.Repository.TaskRepository;
import com.csc12005.hr.Service.TaskService.ITaskService;
import com.csc12005.hr.Utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TaskService implements ITaskService {
	private final TaskRepository taskRepository;
	private final ProjectRepository projectRepository;
	private final EmployeeRepository employeeRepository;
	private final TaskMapper taskMapper;
	private final SecurityUtils securityUtils;
	public TaskResponse createTask(TaskCreationRequest taskCreationRequest) {
		Project project = projectRepository.findById(taskCreationRequest.getProjectId())
				.orElseThrow(() -> new AppException(ErrorCode.PROJECT_NOT_FOUND));
		Employee employee = employeeRepository.findById(taskCreationRequest.getAssignedToId())
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		Task task = taskMapper.toTask(taskCreationRequest);
		task.setProject(project);
		task.setAssignedTo(employee);
		return taskMapper.toTaskResponse(taskRepository.save(task));
	}
	public TaskResponse getTaskById(Long taskId) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));
		return taskMapper.toTaskResponse(task);
	}

	public Page<TaskResponse> getMyTasks(Long projectId,TaskFilterRequest request, PageRequestDTO pageRequestDTO) {
		Long userId = securityUtils.getCurrentUserId();
		Pageable pageable = pageRequestDTO.buildPageable();
		Page<Task> tasks = taskRepository.myTasksByProject(
				projectId,
				request.getTaskName(),
				request.getTaskPriority(),
				request.getTaskStatus(),
				request.getStartDate(),
				request.getDueDate(),
				userId,
				pageable
		);
		return tasks.map(taskMapper::toTaskResponse);
	}
	public Page<TaskResponse> getTasksByProject(Long projectId, TaskFilterRequest taskFilterRequest, PageRequestDTO pageRequestDTO) {
		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new AppException(ErrorCode.PROJECT_NOT_FOUND));
		Pageable pageable = pageRequestDTO.buildPageable();
		Page<Task> tasks = taskRepository.getTasksByProject(
				taskFilterRequest.getTaskName(),
				taskFilterRequest.getTaskPriority(),
				taskFilterRequest.getTaskStatus(),
				taskFilterRequest.getStartDate(),
				taskFilterRequest.getDueDate(),
				project.getId(),
				pageable
		);
		return tasks.map(taskMapper::toTaskResponse);
	}
	public TaskResponse updateTaskStatus(Long taskId, UpdateTaskRequest request) {
		Long employeeId = securityUtils.getCurrentUserId();
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new AppException(ErrorCode.TASK_NOT_FOUND));
		Employee leader = task.getProject().getLeader();
		if(request.getStatus() == TaskStatus.DONE) {
			if(!leader.getId().equals(employeeId)) {
				throw new AppException(ErrorCode.FORBIDDEN);
			}
		}
		task.setStatus(request.getStatus());
		return taskMapper.toTaskResponse(taskRepository.save(task));
	}
}

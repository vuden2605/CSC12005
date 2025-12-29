package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.TaskCreationRequest;
import com.csc12005.hr.DTO.Request.TaskFilterRequest;
import com.csc12005.hr.DTO.Request.UpdateTaskRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.TaskResponse;
import com.csc12005.hr.Enums.TaskStatus;
import com.csc12005.hr.Service.TaskService.Impl.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("tasks")
public class TaskController {
	private final TaskService taskService;
	@PreAuthorize("@projectAuthService.canCreateTask(#request.projectId, authentication.getName())")
	@PostMapping
	public ApiResponse<TaskResponse> createTask(@RequestBody @Valid TaskCreationRequest request) {
		return ApiResponse.<TaskResponse>builder()
				.message("Task created successfully")
				.data(taskService.createTask(request))
				.build();
	}
	@GetMapping("/{taskId}")
	public ApiResponse<TaskResponse> getTaskById(@PathVariable("taskId") Long taskId) {
		return ApiResponse.<TaskResponse>builder()
				.message("Get task by ID successfully")
				.data(taskService.getTaskById(taskId))
				.build();
	}
	@GetMapping("/by-project/{projectId}/me")
	public ApiResponse<Page<TaskResponse>> getMyTasks(
				@PathVariable("projectId") Long projectId,
				TaskFilterRequest filterRequest,
				PageRequestDTO pageRequestDTO) {
		return ApiResponse.<Page<TaskResponse>>builder()
				.message("Get my tasks successfully")
				.data(taskService.getMyTasks(projectId, filterRequest, pageRequestDTO))
				.build();

	}
	@PreAuthorize("hasRole('ADMIN') or hasRole('CEO') or @projectAuthService.isProjectLeader(#projectId, authentication.getName())")
	@GetMapping("/by-project/{projectId}")
	public ApiResponse<Page<TaskResponse>> getTasksByProject(
				@PathVariable("projectId") Long projectId,
				TaskFilterRequest filterRequest,
				PageRequestDTO pageRequestDTO) {
		return ApiResponse.<Page<TaskResponse>>builder()
				.message("Get tasks by project ID successfully")
				.data(taskService.getTasksByProject(projectId, filterRequest, pageRequestDTO))
				.build();
	}
	@PutMapping("/{taskId}")
	public ApiResponse<TaskResponse> updateTask(
			@PathVariable("taskId") Long taskId,
			@RequestBody @Valid UpdateTaskRequest request) {
		return ApiResponse.<TaskResponse>builder()
				.message("Task updated successfully")
				.data(taskService.updateTaskStatus(taskId, request))
				.build();
	}

}

package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.TaskCreationRequest;
import com.csc12005.hr.DTO.Request.TaskFilterRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.TaskResponse;
import com.csc12005.hr.Enums.TaskStatus;
import com.csc12005.hr.Service.TaskService.Impl.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TaskController {
	private final TaskService taskService;
	@PreAuthorize("@projectAuthService.canCreateTask(#request.projectId, authentication.getName())")
	@PostMapping("/tasks")
	public ApiResponse<TaskResponse> createTask(@RequestBody @Valid TaskCreationRequest request) {
		return ApiResponse.<TaskResponse>builder()
				.message("Task created successfully")
				.data(taskService.createTask(request))
				.build();
	}
	@GetMapping("/tasks/me")
	public ApiResponse<Page<TaskResponse>> getMyTasks(TaskFilterRequest filterRequest, PageRequestDTO pageRequestDTO) {
		return ApiResponse.<Page<TaskResponse>>builder()
				.message("Get my tasks successfully")
				.data(taskService.getMyTasks(filterRequest, pageRequestDTO))
				.build();

	}
}

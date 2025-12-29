package com.csc12005.hr.Service.TaskService;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.TaskCreationRequest;
import com.csc12005.hr.DTO.Request.TaskFilterRequest;
import com.csc12005.hr.DTO.Request.UpdateTaskRequest;
import com.csc12005.hr.DTO.Response.TaskResponse;
import com.csc12005.hr.Enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface ITaskService {
	TaskResponse createTask(TaskCreationRequest taskCreationRequest);
	Page<TaskResponse> getMyTasks(Long projectId, TaskFilterRequest request, PageRequestDTO pageRequestDTO);
	Page<TaskResponse> getTasksByProject(Long projectId, TaskFilterRequest taskFilterRequest, PageRequestDTO pageRequestDTO);
	TaskResponse updateTaskStatus(Long taskId, UpdateTaskRequest request);
}

package com.csc12005.hr.Service.TaskService;

import com.csc12005.hr.DTO.Request.TaskCreationRequest;
import com.csc12005.hr.DTO.Response.TaskResponse;
import org.springframework.stereotype.Service;

@Service
public interface ITaskService {
	TaskResponse createTask(TaskCreationRequest taskCreationRequest);
}

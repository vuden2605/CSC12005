package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.TaskCreationRequest;
import com.csc12005.hr.DTO.Response.TaskResponse;
import com.csc12005.hr.Entity.Task;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskMapper {
	Task toTask(TaskCreationRequest taskCreationRequest);
	TaskResponse toTaskResponse(Task task);
}

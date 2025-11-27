package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.TaskPriority;
import com.csc12005.hr.Enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskFilterRequest {
	private String taskName;
	private TaskPriority taskPriority;
	private TaskStatus taskStatus;
	private LocalDate startDate;
	private LocalDate dueDate;
	private Long assignedToId;
}

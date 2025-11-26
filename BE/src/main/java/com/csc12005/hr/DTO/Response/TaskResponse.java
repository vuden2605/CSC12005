package com.csc12005.hr.DTO.Response;
import com.csc12005.hr.Enums.TaskPriority;
import com.csc12005.hr.Enums.TaskStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskResponse {
	private Long id;
	private String taskName;
	private String description;
	private TaskPriority priority;
	private TaskStatus status;
	private Long estimatedTime;
	private Long timeSpent;
	private LocalDate startDate;
	private LocalDate dueDate;
	private LocalDate completedDate;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private ProjectResponse project;
	private EmployeeResponse assignedTo;
}

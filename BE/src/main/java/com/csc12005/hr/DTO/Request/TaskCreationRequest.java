package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Project;
import com.csc12005.hr.Enums.TaskPriority;
import com.csc12005.hr.Enums.TaskStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskCreationRequest {
	@NotBlank(message =  "REQUIRED_TASK_NAME")
	private String taskName;
	@NotBlank(message =  "REQUIRED_TASK_DESCRIPTION")
	private String description;
	@NotNull(message = "REQUIRED_TASK_PRIORITY")
	private TaskPriority priority;
	private Long estimatedTime;
	@NotNull(message = "REQUIRED_TASK_TIME_SPENT")
	private Long timeSpent;
	@NotNull(message = "REQUIRED_TASK_START_DATE")
	private LocalDate startDate;
	@NotNull(message = "REQUIRED_TASK_DUE_DATE")
	private LocalDate dueDate;
	@NotNull(message = "REQUIRED_PROJECT_ID")
	private Long projectId;
	@NotNull(message = "REQUIRED_EMPLOYEE_ID")
	private Long assignedToId;
}

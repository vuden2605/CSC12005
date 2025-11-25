package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Enums.ProjectPriority;
import com.csc12005.hr.Enums.ProjectStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectCreationRequest {
	@NotBlank(message =  "REQUIRED_PROJECT_CODE")
	private String projectCode;
	@NotBlank(message =  "REQUIRED_PROJECT_NAME")
	private String projectName;
	private String description;
	@NotNull(message = "REQUIRED_PROJECT_START_DATE")
	private LocalDate startDate;
	@NotNull(message = "REQUIRED_PROJECT_END_DATE")
	private LocalDate endDate;
	@NotNull(message = "REQUIRED_PROJECT_PRIORITY")
	private ProjectPriority priority;
	@NotNull(message = "REQUIRED_DEPARTMENT_ID")
	private Long departmentId;
}

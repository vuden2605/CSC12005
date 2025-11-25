package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Enums.ProjectPriority;
import com.csc12005.hr.Enums.ProjectStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectResponse {
	private Long id;
	private String projectCode;
	private String projectName;
	private String description;
	private LocalDate startDate;
	private LocalDate endDate;
	private ProjectStatus status;
	private ProjectPriority priority;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private Double progress_percentage;
	private DepartmentResponse department;
	private EmployeeResponse leader;
}

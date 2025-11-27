package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Project;
import com.csc12005.hr.Enums.ProjectMemberRole;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectMemberResponse {
	private Long id;
	private ProjectMemberRole role;
	private LocalDate joinedDate;
	private LocalDate leftDate;
	private boolean isActive;
	private EmployeeResponse employee;
	private ProjectResponse project;
}

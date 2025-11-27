package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Project;
import com.csc12005.hr.Enums.ProjectMemberRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMemberCreationRequest {
	private ProjectMemberRole role;
	private LocalDate joinedDate;
	private Long employeeId;
	private Long projectId;
}

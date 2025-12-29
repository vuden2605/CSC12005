package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.ProjectMemberRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
	name = "project_members",
	uniqueConstraints = {
		@UniqueConstraint(columnNames = {"employee_id", "project_id"})
	})
public class ProjectMember {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Enumerated(EnumType.STRING)
	private ProjectMemberRole role;
	@Builder.Default
	private LocalDate joinedDate = LocalDate.now();
	private LocalDate leftDate;
	@Builder.Default
	private boolean isActive = true;
	@ManyToOne
	@JoinColumn(name = "employee_id")
	private Employee employee;
	@ManyToOne
	@JoinColumn(name = "project_id")
	private Project project;
}

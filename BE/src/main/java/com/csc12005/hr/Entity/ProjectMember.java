package com.csc12005.hr.Entity;

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
@Table(name = "project_members")
public class ProjectMember {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String role;
	private LocalDate joinedDate;
	private LocalDate leftDate;
	private boolean isActive;
	@ManyToOne
	@JoinColumn(name = "employee_id")
	private Employee employee;
	@ManyToOne
	@JoinColumn(name = "project_id")
	private Project project;
}

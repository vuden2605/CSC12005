package com.csc12005.hr.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "departments")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Department {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long departmentId;
	private String departmentName;
	private String departmentCode;
	@OneToOne
	@JoinColumn(name = "manager_id")
	private Employee manager;
}

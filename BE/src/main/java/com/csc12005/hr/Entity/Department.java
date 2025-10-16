package com.csc12005.hr.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "departments")
public class Department {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long departmentId;
	private String departmentName;
	private String departmentCode;
}

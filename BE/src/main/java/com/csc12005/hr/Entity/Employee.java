package com.csc12005.hr.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "employees")
public class Employee {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long employeeId;
	private String employeeCode;
	private String fullName;
	private String email;
	private String phone;
	private String address;
	private LocalDate birthDate;
	private String nationalCode;
	private String taxCode;
	private String bankName;
	private String bankAccount;
	private LocalDate hireDate;
	@Builder.Default
	private Boolean status = true;
	private Long baseSalary;
	@Builder.Default
	private Long totalPoints = 0L;
	private String password;
	@ManyToOne
	@JoinColumn(name = "department_id")
	private Department department;
	@ManyToOne
	@JoinColumn(name = "position_id")
	private Position position;
	@ManyToOne
	@JoinColumn(name = "manager_id")
	private Employee manager;
}

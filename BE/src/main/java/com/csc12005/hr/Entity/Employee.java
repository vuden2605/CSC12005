package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.EmployeeRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "employees")
public class Employee {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String employeeCode;
	private String fullName;
	private String email;
	private String phone;
	private LocalDate birthDate;
	private String nationalCode;
	private String taxCode;
	private String bankName;
	@CreationTimestamp
	private LocalDate hireDate;
	@Builder.Default
	private Boolean status = true;
	private Long baseSalary;
	@Builder.Default
	private Long totalPoints = 0L;
	private String password;
    private String bankAccount;
    private String address;
    @ManyToOne
	@JoinColumn(name = "department_id")
	private Department department;
	@ManyToOne
	@JoinColumn(name = "position_id")
	private Position position;
	@ManyToOne
	@JoinColumn(name = "manager_id")
	private Employee manager;
	@Enumerated(EnumType.STRING)
	@Builder.Default
	private EmployeeRole role = EmployeeRole.EMP;
	private String avatarUrl;
}

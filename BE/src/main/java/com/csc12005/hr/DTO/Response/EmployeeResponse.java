package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Enums.EducationLevel;
import com.csc12005.hr.Enums.EmployeeRole;
import com.csc12005.hr.Enums.MarialStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Entity;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeResponse {
	private Long id;
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
    private Boolean status ;
    private Long baseSalary;
	private LocalDate hireDate;
	private DepartmentResponse department;
	private PositionResponse position;
	private String managerName;
	private String managerCode;
	private Long managerId;
	private String avatarUrl;
	private EmployeeRole role;
	private String permanentAddress;
	private MarialStatus marialStatus;
	private EducationLevel educationLevel;
	private String major;
	private String university;
	private String gender;
	private Long totalPoints;
	private Long allocatedPoints;
}

package com.csc12005.hr.DTO.Response;

import jakarta.persistence.Entity;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
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
	private Long baseSalary;
	private DepartmentResponse department;
	private PositionResponse position;
	private String managerName;
}

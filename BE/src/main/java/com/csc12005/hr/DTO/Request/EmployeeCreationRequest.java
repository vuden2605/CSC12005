package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Position;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeCreationRequest {
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
	private String password;
	private Long departmentId;
	private Long positionId;
	private Long managerId;
}

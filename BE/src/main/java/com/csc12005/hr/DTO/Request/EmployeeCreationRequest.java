package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Position;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeCreationRequest {
	@NotBlank(message = "REQUIRED_FULL_NAME")
	private String fullName;
	@Email(message = "INVALID_EMAIL")
	private String email;
	@NotBlank(message = "INVALID_PHONE")
	@Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "INVALID_PHONE")
	private String phone;
	@NotBlank(message = "REQUIRED_ADDRESS")
	private String address;
	@NotBlank(message = "REQUIRED_BIRTH_DATE")
	private LocalDate birthDate;
	@NotBlank(message = "REQUIRED_NATIONAL_CODE")
	private String nationalCode;
	@NotBlank(message = "REQUIRED_TAX_CODE")
	private String taxCode;
	@NotBlank(message = "REQUIRED_BANK_NAME")
	private String bankName;
	@NotBlank(message = "REQUIRED_BANK_ACCOUNT")
	private String bankAccount;
	@NotBlank(message = "REQUIRED_BASE_SALARY")
	private Long baseSalary;
	@NotBlank(message = "REQUIRED_DEPARTMENT_ID")
	private Long departmentId;
	@NotBlank(message = "REQUIRED_POSITION_ID")
	private Long positionId;
	private String avatarUrl;
}

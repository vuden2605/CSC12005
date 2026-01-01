package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

	@NotBlank(message = "REQUIRED_GENDER")
	private String gender;

	@Email(message = "INVALID_EMAIL")
	private String email;

	@NotBlank(message = "INVALID_PHONE")
	@Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "INVALID_PHONE")
	private String phone;

	private String emergencyContactPhone;

	private String emergencyContactName;

	private String emergencyContactRelationship;

	@NotNull(message = "REQUIRED_BIRTH_DATE")
	private LocalDate birthDate;

	@NotBlank(message = "REQUIRED_NATIONAL_CODE")
	private String nationalCode;

	@NotBlank(message = "REQUIRED_TAX_CODE")
	private String taxCode;

	private String placeOfBirth;

	private String nationality;

	private String religion;

	@NotBlank(message = "REQUIRED_BANK_NAME")
	private String bankName;

	@NotBlank(message = "REQUIRED_BANK_ACCOUNT")
	private String bankAccount;

	@NotNull(message = "REQUIRED_BASE_SALARY")
	private Long baseSalary;

	@NotBlank(message = "REQUIRED_ADDRESS")
	private String address;

	private String permanentAddress;

	private MaritalStatus maritalStatus;

	private EducationLevel educationLevel;

	private String major;

	private String university;

	private Integer graduationYear;

	private String degree;
	@NotNull(message = "REQUIRED_DEPARTMENT_ID")
	private Long departmentId;
	@NotNull(message = "REQUIRED_POSITION_ID")
	private Long positionId;

	private LocalDate hireDate;

	private String avatarUrl;

	private LocalDate contractStartDate;

	private LocalDate contractEndDate;

	private ContractType contractType;

	private WorkSchedule workSchedule;

	private String socialInsuranceNumber;

	private String healthInsuranceNumber;

	private String bankBranch;
}

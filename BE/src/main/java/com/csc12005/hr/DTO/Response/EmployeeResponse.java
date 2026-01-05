package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Enums.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeResponse {
	private Long id;

	private String employeeCode;

	private String fullName;

	private String gender;

	private String email;

	private String phone;

	private String emergencyContactPhone;

	private String emergencyContactName;

	private String emergencyContactRelationship;

	private LocalDate birthDate;

	private String nationalCode;

	private String taxCode;

	private String placeOfBirth;

	private String nationality;

	private String religion;

	private String bankName;

	private String bankAccount;

    private Boolean status ;

    private BigDecimal baseSalary;

	private Long totalPoints;

	private Long allocatePoints;

	private String address;

	private String permanentAddress;

	private MaritalStatus maritalStatus;

	private EducationLevel educationLevel;

	private LocalDate hireDate;

	private String major;

	private String university;

	private Integer graduationYear;

	private String degree;

	private DepartmentResponse department;

	private PositionResponse position;

	private String managerName;

	private String managerCode;

	private Long managerId;

	private String avatarUrl;

	private LocalDate contractStartDate;

	private LocalDate contractEndDate;

	private EmploymentStatus employmentStatus;

	private LocalDate terminationDate;

	private String terminationReason;

	private WorkSchedule workSchedule;

	private String socialInsuranceNumber;

	private String healthInsuranceNumber;

	private String bankBranch;

	private EmployeeRole role;

	private Integer annualLeave;

	private Integer usedLeave;

	private Integer usedSickLeaveDays;

	private Integer usedPersonalLeaveDays;

	private Boolean isOnMaternityLeave;

	private LocalDate maternityStartDate;

	private LocalDate maternityEndDate;

	private Boolean isActive;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	private Integer numberOfDependents;
}

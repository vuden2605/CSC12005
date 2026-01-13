package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.ContractType;
import com.csc12005.hr.Enums.EducationLevel;
import com.csc12005.hr.Enums.MaritalStatus;
import com.csc12005.hr.Enums.WorkSchedule;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeHRUpdateRequest {
    @NotBlank(message = "REQUIRED_FULL_NAME")
    private String fullName;

    @NotNull(message = "REQUIRED_GENDER")
    private String gender;

    @Email(message = "INVALID_EMAIL")
    @NotBlank(message = "REQUIRED_EMAIL")
    private String email;

    @NotBlank(message = "REQUIRED_PHONE")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "INVALID_PHONE")
    private String phone;

    @NotNull(message = "REQUIRED_BIRTH_DATE")
    private LocalDate birthDate;

    @NotBlank(message = "REQUIRED_NATIONAL_CODE")
    private String nationalCode;

    @NotBlank(message = "REQUIRED_TAX_CODE")
    private String taxCode;

    @NotBlank(message = "REQUIRED_ADDRESS")
    private String address;

    // ========== Thông tin liên hệ khẩn cấp ==========
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelationship;

    // ========== Thông tin cá nhân bổ sung ==========
    private String placeOfBirth;
    private String nationality;
    private String religion;
    private String permanentAddress;
    private MaritalStatus maritalStatus;

    // ========== Thông tin học vấn ==========
    private EducationLevel educationLevel;
    private String major;
    private String university;
    private Integer graduationYear;
    private String degree;
    private Integer numberOfDependents;

    // ========== Thông tin ngân hàng ==========
    @NotBlank(message = "REQUIRED_BANK_NAME")
    private String bankName;

    @NotBlank(message = "REQUIRED_BANK_ACCOUNT")
    private String bankAccount;

    private String bankBranch;

    // ========== Thông tin công việc ==========
    @NotNull(message = "REQUIRED_BASE_SALARY")
    private BigDecimal baseSalary;

    @NotNull(message = "REQUIRED_DEPARTMENT_ID")
    private Long departmentId;

    @NotNull(message = "REQUIRED_POSITION_ID")
    private Long positionId;

    private LocalDate hireDate;
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private ContractType contractType;
    private WorkSchedule workSchedule;

    // ========== Bảo hiểm ==========
    private String socialInsuranceNumber;
    private String healthInsuranceNumber;


}

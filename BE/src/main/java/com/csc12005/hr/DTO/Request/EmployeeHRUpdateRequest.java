package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeHRUpdateRequest {
    @NotBlank(message = "REQUIRED_FULL_NAME")
    private String fullName;
    @Email(message = "INVALID_EMAIL")
    private String email;
    @NotBlank(message = "INVALID_PHONE")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "INVALID_PHONE")
    private String phone;
    @NotNull(message = "REQUIRED_BIRTH_DATE")
    private LocalDate birthDate;
    @NotBlank(message = "REQUIRED_NATIONAL_CODE")
    private String nationalCode;
    @NotBlank(message = "REQUIRED_TAX_CODE")
    private String taxCode;
    @NotBlank(message = "REQUIRED_BANK_NAME")
    private String bankName;
    @NotBlank(message = "REQUIRED_BANK_ACCOUNT")
    private String bankAccount;
    @NotNull(message = "REQUIRED_BASE_SALARY")
    private Long baseSalary;
    @NotNull(message = "REQUIRED_DEPARTMENT_ID")
    private Long departmentId;
    @NotNull(message = "REQUIRED_POSITION_ID")
    private Long positionId;
}

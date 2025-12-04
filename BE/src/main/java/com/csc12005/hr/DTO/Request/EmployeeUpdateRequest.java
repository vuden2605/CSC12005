package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeUpdateRequest {
    @NotBlank(message = "REQUIRED_EMAIL")
    @Email(message = "INVALID_EMAIL")
    private String email;
    @NotBlank(message = "INVALID_PHONE")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "INVALID_PHONE")
    private String phone;
    @NotBlank(message = "REQUIRED_ADDRESS")
    private String address;
    private MultipartFile avatar;
}

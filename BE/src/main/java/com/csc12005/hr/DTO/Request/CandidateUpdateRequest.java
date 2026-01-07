package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CandidateUpdateRequest {
    @NotBlank(message = "REQUIRED_FULL_NAME")
    private String fullName;
    @Email(message = "INVALID_EMAIL")
    private String email;
    @NotBlank(message = "REQUIRED_GENDER")
    private String gender;
    @NotBlank(message = "INVALID_PHONE")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "INVALID_PHONE")
    private String phone;
    @NotBlank(message = "REQUIRED_ADDRESS")
    private String address;
    @NotNull(message = "REQUIRED_BIRTH_DATE")
    private LocalDate birthDate;
    private MultipartFile cv;
    @NotNull(message = "REQUIRED_POSITION_ID")
    private Long positionId;
}

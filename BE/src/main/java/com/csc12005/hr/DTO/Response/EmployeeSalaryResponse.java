package com.csc12005.hr.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeSalaryResponse {
    private Long id;
    private String fullName;
    private String email;
    private String positionName;
}

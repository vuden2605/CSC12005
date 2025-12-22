package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.NotNull;


public class DeactivateEmployeeRequest {
    @NotNull
    public Long employeeId;
}

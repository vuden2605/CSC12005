package com.csc12005.hr.DTO.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ViewSubEmployeeBasicResponse {

    private Long employeeId;
    private String employeeCode;
    private String fullName;
    private String email;
    private String phone;
    private String departmentName;
    private String positionName;
    private String status;
}

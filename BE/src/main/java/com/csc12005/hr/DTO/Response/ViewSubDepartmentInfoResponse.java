package com.csc12005.hr.DTO.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ViewSubDepartmentInfoResponse {

    private Long departmentId;
    private String departmentName;
    private long totalEmployees;
}

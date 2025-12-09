package com.csc12005.hr.DTO.Response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ViewSubEmployeesListResponse {

    private List<ViewSubEmployeeBasicResponse> employees;
    private ViewSubEmployeesPaginationResponse pagination;
    private ViewSubDepartmentInfoResponse departmentInfo;
}

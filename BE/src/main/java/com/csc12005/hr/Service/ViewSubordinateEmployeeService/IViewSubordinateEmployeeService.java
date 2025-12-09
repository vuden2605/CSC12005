package com.csc12005.hr.Service.ViewSubordinateEmployeeService;

import com.csc12005.hr.DTO.Request.ViewSubEmployeesFilterRequest;
import com.csc12005.hr.DTO.Response.ViewSubordinateEmployeesListResponse;

public interface IViewSubordinateEmployeeService {


    ViewSubordinateEmployeesListResponse getSubordinateEmployees(
            Long managerId,
            ViewSubEmployeesFilterRequest filter
    );


    byte[] exportSubordinateEmployees(Long managerId, String format);
}

package com.csc12005.hr.Service;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Request.EmployeeUpdateRequest;
import com.csc12005.hr.DTO.Response.EmployeeResponse;

public interface IEmployeeService {
    public EmployeeResponse createEmployee(EmployeeCreationRequest employeeCreationRequest) ;
    public EmployeeResponse getMyInfo();
    public EmployeeResponse updateUser(EmployeeUpdateRequest employeeUpdateRequest);
}

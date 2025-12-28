package com.csc12005.hr.Service.EmployeeService;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Request.EmployeeHRUpdateRequest;
import com.csc12005.hr.DTO.Request.EmployeeUpdateRequest;
import com.csc12005.hr.DTO.Response.EmployeeResponse;

import java.util.List;

public interface IEmployeeService {
    public EmployeeResponse createEmployee(EmployeeCreationRequest employeeCreationRequest) ;
    public EmployeeResponse getMyInfo(Long userId);
    public EmployeeResponse updateUser(EmployeeUpdateRequest employeeUpdateRequest, Long id);
    public EmployeeResponse hrUpdateEmployee(EmployeeHRUpdateRequest employeeHRUpdateRequest, Long id);
    public List<EmployeeResponse> getAll();
    public EmployeeResponse updateStatus(Long id);
}

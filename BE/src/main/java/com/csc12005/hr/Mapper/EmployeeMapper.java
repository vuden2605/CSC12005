package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.Entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EmployeeMapper{
	Employee toEmployee(EmployeeCreationRequest employeeCreationRequest);
	EmployeeResponse toEmployeeResponse(Employee employee);
}

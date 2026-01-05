package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Request.EmployeeHRUpdateRequest;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.Entity.Employee;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface EmployeeMapper{
	Employee toEmployee(EmployeeCreationRequest employeeCreationRequest);
    @Mapping(target = "position", source = "position")
    @Mapping(target = "department", source = "department")
    EmployeeResponse toEmployeeResponse(Employee employee);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEmployeeFromDto(EmployeeHRUpdateRequest dto, @MappingTarget Employee employee);
}

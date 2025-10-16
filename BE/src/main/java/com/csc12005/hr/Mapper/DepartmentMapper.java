package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.DepartmentCreationRequest;
import com.csc12005.hr.DTO.Response.DepartmentResponse;
import com.csc12005.hr.Entity.Department;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {
	Department toDepartment(DepartmentCreationRequest departmentCreationRequest);
	DepartmentResponse toDepartmentResponse(Department department);
}

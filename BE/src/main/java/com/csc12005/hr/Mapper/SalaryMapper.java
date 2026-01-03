package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Response.SalaryResponse;
import com.csc12005.hr.Entity.Salary;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SalaryMapper {
	@Mapping(source = "salary.employee.id", target = "employeeId")
	@Mapping(source = "salary.employee.fullName", target = "employeeName")
	@Mapping(source = "salary.employee.employeeCode", target = "employeeCode")
	@Mapping(source = "salary.employee.position.positionName", target = "positionName")
	SalaryResponse toSalaryResponse(Salary salary);
}

package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Response.PointExchangeResponse;
import com.csc12005.hr.Entity.PointExchange;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PointExchangeMapper {
	@Mapping(source = "employee.fullName", target = "employeeName")
	@Mapping(source = "employee.employeeCode", target = "employeeCode")
	PointExchangeResponse toPointExchangeResponse(PointExchange pointExchange);
}

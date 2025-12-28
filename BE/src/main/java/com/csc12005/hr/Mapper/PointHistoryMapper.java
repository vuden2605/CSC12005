package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Response.PointHistoryResponse;
import com.csc12005.hr.Entity.PointHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PointHistoryMapper {
	@Mapping(source = "employee.fullName", target = "employeeName")
	@Mapping(source = "employee.employeeCode", target = "employeeCode")
	PointHistoryResponse toPointHistoryResponse(PointHistory pointHistory);
}

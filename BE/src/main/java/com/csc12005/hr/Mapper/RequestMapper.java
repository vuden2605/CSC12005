package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Request;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RequestMapper {
	Request toRequest(RequestCreationRequest requestCreationRequest);
	@Mapping(source = "request.employee.fullName", target = "employeeName")
	@Mapping(source = "request.employee.employeeCode", target = "employeeCode")
	RequestResponse toRequestResponse(Request request);
}

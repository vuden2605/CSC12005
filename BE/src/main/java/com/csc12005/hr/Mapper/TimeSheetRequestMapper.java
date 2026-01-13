package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.TimeSheetRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TimeSheetRequestMapper {
	TimeSheetRequest toTimeSheetRequest(RequestCreationRequest timeSheetRequestCreationRequest);
	@Mapping(source = "timeSheetRequest.employee.fullName", target = "employeeName")
	@Mapping(source = "timeSheetRequest.employee.employeeCode", target = "employeeCode")
	RequestResponse toTimeSheetRequestResponse(TimeSheetRequest timeSheetRequest);
}

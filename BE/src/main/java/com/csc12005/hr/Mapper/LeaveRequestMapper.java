package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.LeaveRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LeaveRequestMapper {
	LeaveRequest toLeaveRequest(RequestCreationRequest request);
	@Mapping(source = "leaveRequest.employee.fullName", target = "employeeName")
	@Mapping(source = "leaveRequest.employee.employeeCode", target = "employeeCode")
	RequestResponse toLeaveRequestResponse(LeaveRequest leaveRequest);
}

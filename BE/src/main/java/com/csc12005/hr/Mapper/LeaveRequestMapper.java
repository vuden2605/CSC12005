package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.LeaveRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LeaveRequestMapper {
	LeaveRequest toLeaveRequest(RequestCreationRequest request);
	RequestResponse toLeaveRequestResponse(LeaveRequest leaveRequest);
}

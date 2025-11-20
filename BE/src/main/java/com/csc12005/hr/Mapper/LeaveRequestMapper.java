package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.LeaveRequestCreationRequest;
import com.csc12005.hr.DTO.Response.LeaveRequestResponse;
import com.csc12005.hr.Entity.LeaveRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LeaveRequestMapper {
	LeaveRequest toLeaveRequest(LeaveRequestCreationRequest request);
	LeaveRequestResponse toLeaveRequestResponse(LeaveRequest leaveRequest);
}

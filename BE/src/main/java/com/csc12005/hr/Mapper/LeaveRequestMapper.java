package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Response.LeaveRequestResponse;
import com.csc12005.hr.Entity.LeaveRequest;
import org.springframework.stereotype.Component;

@Component
public class LeaveRequestMapper {

    public LeaveRequestResponse toResponse(LeaveRequest leave) {
        return LeaveRequestResponse.builder()
                .id(leave.getId())
                .employeeId(leave.getEmployeeId())
                .requestType(leave.getRequestType())
                .reason(leave.getReason())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .status(leave.getStatus())
                .approver(leave.getApprover())
                .createdAt(leave.getCreatedAt())
                .build();
    }
}

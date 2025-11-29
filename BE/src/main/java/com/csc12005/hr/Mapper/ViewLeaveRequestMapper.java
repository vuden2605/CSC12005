package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Response.LeaveRequestListItemResponse;
import com.csc12005.hr.Entity.LeaveRequest;
import org.springframework.stereotype.Component;

@Component
public class ViewLeaveRequestMapper {

    public LeaveRequestListItemResponse toListItem(LeaveRequest req,
                                                String employeeName,
                                                String leaveTypeName) {

        LeaveRequestListItemResponse dto = new LeaveRequestListItemResponse();

        dto.setRequestId(req.getId());
        dto.setEmployeeName(employeeName);        // lấy từ service
        dto.setLeaveTypeName(leaveTypeName);      // lấy từ service
        dto.setStartDate(req.getStartDate().toLocalDate());
        dto.setEndDate(req.getEndDate().toLocalDate());
        dto.setReason(req.getReason());
        dto.setStatus(req.getStatus().name());
        dto.setCreatedAt(req.getCreatedAt());

        return dto;
    }
}

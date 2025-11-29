package com.csc12005.hr.Service.ViewLeaveRequestService;

import com.csc12005.hr.DTO.Request.ViewLeaveRequestFilterRequest;
import com.csc12005.hr.DTO.Response.LeaveRequestListResponse;

public interface IViewLeaveRequestService {
    LeaveRequestListResponse getLeaveRequests(Long employeeId, ViewLeaveRequestFilterRequest filters);
}

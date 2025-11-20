package com.csc12005.hr.Service.LeaveRequestService;

import com.csc12005.hr.DTO.Request.LeaveRequestCreationRequest;
import com.csc12005.hr.DTO.Response.LeaveRequestResponse;
import org.springframework.stereotype.Service;

@Service
public interface ILeaveRequestService {
	LeaveRequestResponse createLeaveRequest(LeaveRequestCreationRequest request);
}

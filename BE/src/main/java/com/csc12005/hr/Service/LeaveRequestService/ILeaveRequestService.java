package com.csc12005.hr.Service.LeaveRequestService;

// import java.util.List;
// import java.util.concurrent.CompletableFuture;

import com.csc12005.hr.DTO.Request.LeaveRequestCreationRequest;
import com.csc12005.hr.DTO.Response.LeaveRequestResponse;

public interface ILeaveRequestService {

    LeaveRequestResponse approveLeaveRequest(Long id, LeaveRequestCreationRequest dto);
}

package com.csc12005.hr.Service;

import com.csc12005.hr.DTO.Request.LeaveRequestCreationRequest;
import com.csc12005.hr.DTO.Response.LeaveResponse;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface ILeaveRequestService {
    CompletableFuture<LeaveResponse> createLeaveRequestAsync(Integer employeeId, LeaveRequestCreationRequest dto);
    CompletableFuture<List<LeaveResponse>> getLeaveRequestsAsync(Integer employeeId, String filters);
    CompletableFuture<Double> getLeaveBalanceAsync(Integer employeeId);
}
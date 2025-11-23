package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.LeaveRequestCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.LeaveRequestResponse;
import com.csc12005.hr.Service.LeaveRequestService.Impl.LeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class LeaveRequestController {
	private final LeaveRequestService leaveRequestService;
	@PostMapping("/leave-requests")
	public ApiResponse<LeaveRequestResponse> createLeaveRequest(LeaveRequestCreationRequest request) {
		return ApiResponse.<LeaveRequestResponse>builder()
				.data(leaveRequestService.createLeaveRequest(request))
				.build();
	}
	@PatchMapping("/leave-requests/{id}/approve")
	public ApiResponse<LeaveRequestResponse> approveLeaveRequest(Long id) {
		return ApiResponse.<LeaveRequestResponse>builder()
				.data(leaveRequestService.approvedLeaveRequest(id))
				.build();
	}
	@PatchMapping("/leave-requests/{id}/reject")
	public ApiResponse<LeaveRequestResponse> rejectLeaveRequest(Long id) {
		return ApiResponse.<LeaveRequestResponse>builder()
				.data(leaveRequestService.rejectedLeaveRequest(id))
				.build();
	}
}

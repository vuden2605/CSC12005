package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.LeaveRequestCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.LeaveRequestResponse;
import com.csc12005.hr.Service.LeaveRequestService.Impl.LeaveRequestService;
import lombok.RequiredArgsConstructor;
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
}

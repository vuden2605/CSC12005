package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.LeaveRequestCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.LeaveRequestResponse;
import com.csc12005.hr.Service.LeaveRequestService.Impl.LeaveRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class LeaveRequestController {
	private final LeaveRequestService leaveRequestService;
	@PostMapping(
		value = "/leave-requests",
		consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<LeaveRequestResponse> createLeaveRequest(@ModelAttribute @Valid LeaveRequestCreationRequest request) {
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
	@GetMapping("/leave-requests/{id}")
	public ApiResponse<LeaveRequestResponse> getLeaveRequestById(@PathVariable Long id) {
		return ApiResponse.<LeaveRequestResponse>builder()
				.data(leaveRequestService.getLeaveRequestById(id))
				.build();
	}
}

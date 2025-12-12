package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.TimeSheetRequestResponse;
import com.csc12005.hr.Service.TimeSheetRequestService.Impl.TimeSheetRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class TimeSheetRequestController {
	private final TimeSheetRequestService timeSheetRequestService;
	@PostMapping(
		value = "/timesheet-requests",
		consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<TimeSheetRequestResponse> createTimesheetRequest(@ModelAttribute @Valid TimeSheetRequestCreationRequest timeSheetRequest) {
		return ApiResponse.<TimeSheetRequestResponse>builder()
				.message("Time sheet request created successfully")
				.data(timeSheetRequestService.createTimeSheetRequest(timeSheetRequest))
				.build();
	}
	@PreAuthorize("@timeSheetRequestAuthService.canApproveOrRejectRequest(#id, authentication.getName())")
	@PutMapping("/timesheet-requests/{id}/approve")
	public ApiResponse<TimeSheetRequestResponse> approveTimesheetRequest(@PathVariable Long id) {
		return ApiResponse.<TimeSheetRequestResponse>builder()
				.message("Time sheet request approved successfully")
				.data(timeSheetRequestService.approvedTimeSheetRequest(id))
				.build();
	}
	@PreAuthorize("@timeSheetRequestAuthService.canApproveOrRejectRequest(#id, authentication.getName())")
	@PutMapping("/timesheet-requests/{id}/reject")
	public ApiResponse<TimeSheetRequestResponse> rejectTimesheetRequest(@PathVariable Long id) {
		return ApiResponse.<TimeSheetRequestResponse>builder()
				.message("Time sheet request rejected successfully")
				.data(timeSheetRequestService.rejectedTimeSheetRequest(id))
				.build();
	}
	@GetMapping("/timesheet-requests/{id}")
	public ApiResponse<TimeSheetRequestResponse> getTimeSheetRequestById(@PathVariable Long id) {
		return ApiResponse.<TimeSheetRequestResponse>builder()
				.message("Time sheet request fetched successfully")
				.data(timeSheetRequestService.getTimeSheetRequestById(id))
				.build();
	}
}

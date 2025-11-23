package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.TimeSheetRequestResponse;
import com.csc12005.hr.Service.TimeSheetRequestService.Impl.TimeSheetRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class TimeSheetRequestController {
	private final TimeSheetRequestService timeSheetRequestService;
	@PostMapping("/timesheet-requests")
	public ApiResponse<TimeSheetRequestResponse> createTimesheetRequest(@RequestBody @Valid TimeSheetRequestCreationRequest timeSheetRequest) {
		return ApiResponse.<TimeSheetRequestResponse>builder()
				.message("Time sheet request created successfully")
				.data(timeSheetRequestService.createTimeSheetRequest(timeSheetRequest))
				.build();
	}
	public ApiResponse<TimeSheetRequestResponse> approveTimesheetRequest(@PathVariable Long id) {
		return ApiResponse.<TimeSheetRequestResponse>builder()
				.message("Time sheet request approved successfully")
				.data(timeSheetRequestService.approvedTimeSheetRequest(id))
				.build();
	}
	public ApiResponse<TimeSheetRequestResponse> rejectTimesheetRequest(@PathVariable Long id) {
		return ApiResponse.<TimeSheetRequestResponse>builder()
				.message("Time sheet request rejected successfully")
				.data(timeSheetRequestService.rejectedTimeSheetRequest(id))
				.build();
	}
}

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
	@PatchMapping("/timesheet-requests/{id}")
	public ApiResponse<TimeSheetRequestResponse> updateTimesheetRequest(
													@RequestBody @Valid UpdateTimeSheetRequest updateTimeSheetRequest,
													@PathVariable Long id )
	{
		return ApiResponse.<TimeSheetRequestResponse>builder()
				.message("Update time sheet successfully")
				.data(timeSheetRequestService.updateTimeSheetRequest(updateTimeSheetRequest,id))
				.build();
	}
}

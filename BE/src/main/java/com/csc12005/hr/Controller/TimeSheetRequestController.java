package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.TimeSheetRequestResponse;
import com.csc12005.hr.Entity.TimeSheetRequest;
import com.csc12005.hr.Service.TimeSheetRequestService.Impl.TimeSheetRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TimeSheetRequestController {
	private final TimeSheetRequestService timeSheetRequestService;
	@PostMapping("/timesheet-requests")
	public ApiResponse<TimeSheetRequestResponse> createTimesheetRequest(@RequestBody TimeSheetRequestCreationRequest timeSheetRequest) {
		return ApiResponse.<TimeSheetRequestResponse>builder()
				.message("Time sheet request created successfully")
				.data(timeSheetRequestService.createTimeSheetRequest(timeSheetRequest))
				.build();
	}
}

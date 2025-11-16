package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.TimeSheetCreationRequest;
import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.TimeSheetResponse;
import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Service.TimeSheetService.Impl.TimeSheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TimeSheetController {
	private final TimeSheetService timeSheetService;
	@PostMapping("/timesheets" )
	public ApiResponse<TimeSheetResponse> createTimeSheet(@RequestBody TimeSheetCreationRequest timeSheetCreationRequest){
		return ApiResponse.<TimeSheetResponse>builder()
				.message("Time sheet created successfully")
				.data(timeSheetService.createTimeSheet(timeSheetCreationRequest))
				.build();
	}
}

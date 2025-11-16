package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.WFHCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.WFHResponse;
import com.csc12005.hr.Service.WFHRequestService.Impl.WFHRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class WFHRequestController {
	private final WFHRequestService wfhRequestService;
	@PostMapping("/wfh-requests")
	public ApiResponse<WFHResponse> createWFHRequest(@RequestBody WFHCreationRequest wfhCreationRequest) {
		return ApiResponse.<WFHResponse>builder()
				.message("WFH request created successfully")
				.data(wfhRequestService.createWFHRequest(wfhCreationRequest))
				.build();
	}
}

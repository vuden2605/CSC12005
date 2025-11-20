package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.WFHCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.WFHResponse;
import com.csc12005.hr.Service.WFHRequestService.Impl.WFHRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
	@GetMapping("/wfh-requests")
	public ApiResponse<List<WFHResponse>> getAllWFHRequests() {
		return ApiResponse.<List<WFHResponse>>builder()
				.message("WFH requests retrieved successfully")
				.data(wfhRequestService.getAllWFHRequests())
				.build();
	}
	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/wfh-requests/{id}/approve")
	public ApiResponse<WFHResponse> approveWFHRequest(@PathVariable Long id) {
		return ApiResponse.<WFHResponse>builder()
				.message("WFH request approved successfully")
				.data(wfhRequestService.approveWFHRequest(id))
				.build();
	}
	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/wfh-requests/{id}/reject")
	public ApiResponse<WFHResponse> rejectWFHRequest(@PathVariable Long id) {
		return ApiResponse.<WFHResponse>builder()
				.message("WFH request rejected successfully")
				.data(wfhRequestService.rejectWFHRequest(id))
				.build();
	}
}

package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.RequestActionRequest;
import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Request.RequestFilter;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Service.RequestService.Impl.RequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/requests")
public class RequestController {
	private final RequestService requestService;
	@GetMapping("/by-manager")
	public ApiResponse<Page<RequestResponse>> getRequests (
			PageRequestDTO pageRequest,
			RequestFilter requestFilter) {
		return ApiResponse.<Page<RequestResponse>>builder()
				.message("Get request success")
				.data(requestService.getRequestByManager(pageRequest, requestFilter))
				.build();
	}
	@GetMapping("/me")
	public ApiResponse<Page<RequestResponse>> myRequests (
			PageRequestDTO pageRequest,
			RequestFilter requestFilter) {
		return ApiResponse.<Page<RequestResponse>>builder()
				.message("Get my request success")
				.data(requestService.myRequests(pageRequest, requestFilter))
				.build();
	}
	@PostMapping
	public ApiResponse<RequestResponse> createRequest (
			@ModelAttribute RequestCreationRequest request) {
		return ApiResponse.<RequestResponse>builder()
				.message("Create request success")
				.data(requestService.createRequest(request))
				.build();
	}
	@PutMapping("/{requestId}/approve")
	public ApiResponse<RequestResponse> approveRequest (
			@PathVariable Long requestId, @Valid RequestActionRequest requestActionRequest) {
		return ApiResponse.<RequestResponse>builder()
				.message("Approve request success")
				.data(requestService.approveRequest(requestId, requestActionRequest.getRequestType()))
				.build();
	}
	@PutMapping("/{requestId}/reject")
	public ApiResponse<RequestResponse> rejectRequest (
			@PathVariable Long requestId, @Valid RequestActionRequest requestActionRequest) {
		return ApiResponse.<RequestResponse>builder()
				.message("Reject request success")
				.data(requestService.rejectRequest(requestId, requestActionRequest.getRequestType()))
				.build();
	}
	@GetMapping("/{requestId}")
	public ApiResponse<RequestResponse> getRequestById (
			@PathVariable Long requestId, @Valid RequestActionRequest requestActionRequest) {
		return ApiResponse.<RequestResponse>builder()
				.message("Get request by id success")
				.data(requestService.getRequestById(requestId, requestActionRequest.getRequestType()))
				.build();
	}
}

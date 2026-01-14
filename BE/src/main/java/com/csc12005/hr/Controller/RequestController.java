package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.ProcessManyRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Request.RequestFilter;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Enums.RequestType;
import com.csc12005.hr.Service.RequestService.IRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/requests")
@Slf4j
public class RequestController {
	private final IRequestService requestService;
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
			(
				consumes = MediaType.MULTIPART_FORM_DATA_VALUE
			)
	public ApiResponse<RequestResponse> createRequest (
			@ModelAttribute @Valid RequestCreationRequest request,
			@RequestParam RequestType requestType
			) {
		return ApiResponse.<RequestResponse>builder()
				.message("Create request success")
				.data(requestService.createRequest(request, requestType))
				.build();
	}
	@PutMapping("/{requestId}/approve")
	public ApiResponse<RequestResponse> approveRequest (
			@PathVariable Long requestId,
			@RequestParam RequestType requestType) {
		return ApiResponse.<RequestResponse>builder()
				.message("Approve request success")
				.data(requestService.approveRequest(requestId, requestType))
				.build();
	}
	@PutMapping("/{requestId}/reject")
	public ApiResponse<RequestResponse> rejectRequest (
			@PathVariable Long requestId,
			@RequestParam RequestType requestType) {
		return ApiResponse.<RequestResponse>builder()
				.message("Reject request success")
				.data(requestService.rejectRequest(requestId, requestType))
				.build();
	}
	@GetMapping("/{requestId}")
	public ApiResponse<RequestResponse> getRequestById (
			@PathVariable Long requestId,
			@RequestParam RequestType requestType) {
		return ApiResponse.<RequestResponse>builder()
				.message("Get request by id success")
				.data(requestService.getRequestById(requestId, requestType))
				.build();
	}
	@PutMapping("/approve-many")
	public ApiResponse<Void> approveManyRequests (
			@RequestBody ProcessManyRequest processManyRequest) {
		requestService.approveManyRequests(processManyRequest);
		return ApiResponse.<Void>builder()
				.message("Approve many requests success")
				.build();
	}
	@PutMapping("/reject-many")
	public ApiResponse<Void> rejectManyRequests (
			@RequestBody ProcessManyRequest processManyRequest) {
		requestService.rejectManyRequests(processManyRequest);
		return ApiResponse.<Void>builder()
				.message("Reject many requests success")
				.build();
	}
}

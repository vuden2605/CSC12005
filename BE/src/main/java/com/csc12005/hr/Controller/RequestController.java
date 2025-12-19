package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.RequestFilter;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Service.RequestService.Impl.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RequestController {
	private final RequestService requestService;
	@GetMapping("/requests/by-manager")
	public ApiResponse<Page<RequestResponse>> getRequests (
			PageRequestDTO pageRequest,
			RequestFilter requestFilter) {
		return ApiResponse.<Page<RequestResponse>>builder()
				.message("Get request success")
				.data(requestService.getRequestByManager(pageRequest, requestFilter))
				.build();
	}
	@GetMapping("/requests/me")
	public ApiResponse<Page<RequestResponse>> myRequests (
			PageRequestDTO pageRequest,
			RequestFilter requestFilter) {
		return ApiResponse.<Page<RequestResponse>>builder()
				.message("Get my request success")
				.data(requestService.myRequests(pageRequest, requestFilter))
				.build();
	}
}

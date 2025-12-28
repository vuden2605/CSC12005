package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.PointExchangeFilterRequest;
import com.csc12005.hr.DTO.Request.PointExchangeRequest;
import com.csc12005.hr.DTO.Request.UpdatePointExchangeStatusRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.PointExchangeResponse;
import com.csc12005.hr.Entity.PointExchange;
import com.csc12005.hr.Enums.PointExchangeStatus;
import com.csc12005.hr.Service.PointExchangeService.Impl.PointExchangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/point-exchanges")
public class PointExchangeController {
	private final PointExchangeService pointExchangeService;
	@GetMapping
	public ApiResponse<Page<PointExchangeResponse>> myPointExchanges(PageRequestDTO pageRequestDTO, PointExchangeFilterRequest pointExchangeFilterRequest) {
		Page<PointExchangeResponse> responses = pointExchangeService.myPointExchanges(pageRequestDTO, pointExchangeFilterRequest);
		return ApiResponse.<Page<PointExchangeResponse>>builder()
				.message("Point exchanges retrieved successfully.")
				.data(responses)
				.build();
	}
	@GetMapping("/all")
	public ApiResponse<Page<PointExchangeResponse>> getAllExchanges(PageRequestDTO pageRequestDTO, PointExchangeFilterRequest pointExchangeFilterRequest) {
		Page<PointExchangeResponse> responses = pointExchangeService.getAllExchanges(pageRequestDTO, pointExchangeFilterRequest);
		return ApiResponse.<Page<PointExchangeResponse>>builder()
				.message("All point exchanges retrieved successfully.")
				.data(responses)
				.build();
	}
	@PostMapping
	public ApiResponse<PointExchangeResponse> requestPointExchange(@RequestBody PointExchangeRequest request) {
		return ApiResponse.<PointExchangeResponse>builder()
				.message("Point exchange request submitted successfully.")
				.data(pointExchangeService.requestExchangePoints(request))
				.build();
	}
	@PutMapping("/status")
	public ApiResponse<List<PointExchangeResponse>> updatePointExchangeStatus(
			@RequestBody UpdatePointExchangeStatusRequest statusRequest
			) {
		List<PointExchangeResponse> response = pointExchangeService.updatePointExchangeStatus(
				statusRequest
		);
		return ApiResponse.<List<PointExchangeResponse>>builder()
				.message("Point exchange status updated successfully.")
				.data(response)
				.build();
	}
}

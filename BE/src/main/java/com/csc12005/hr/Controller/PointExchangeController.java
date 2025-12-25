package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.PointExchangeRequest;
import com.csc12005.hr.DTO.Request.UpdatePointExchangeStatusRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.PointExchangeResponse;
import com.csc12005.hr.Entity.PointExchange;
import com.csc12005.hr.Enums.PointExchangeStatus;
import com.csc12005.hr.Service.PointExchangeService.Impl.PointExchangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/point-exchanges")
public class PointExchangeController {
	private final PointExchangeService pointExchangeService;
	@PostMapping
	public ApiResponse<PointExchangeResponse> requestPointExchange(@RequestBody PointExchangeRequest request) {
		return ApiResponse.<PointExchangeResponse>builder()
				.message("Point exchange request submitted successfully.")
				.data(pointExchangeService.requestExchangePoints(request))
				.build();
	}
	@PutMapping("/{exchangeId}/status")
	public ApiResponse<PointExchangeResponse> updatePointExchangeStatus(
			@PathVariable Long exchangeId,
			@RequestBody UpdatePointExchangeStatusRequest statusRequest
			) {
		PointExchangeResponse response = pointExchangeService.updatePointExchangeStatus(
				exchangeId,
				statusRequest
		);
		return ApiResponse.<PointExchangeResponse>builder()
				.message("Point exchange status updated successfully.")
				.data(response)
				.build();
	}
}

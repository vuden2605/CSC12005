package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.Entity.PointHistory;
import com.csc12005.hr.Service.PointHistoryService.Impl.PointHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/point-histories")
@RequiredArgsConstructor
public class PointHistoryController {
	private final PointHistoryService pointHistoryService;
	@GetMapping("/monthly-candidates")
	public ApiResponse<List<EmployeeResponse>> getMonthlyCandidates() {
		List<EmployeeResponse> candidates = pointHistoryService.getMonthlyCandidates();
		return ApiResponse.<List<EmployeeResponse>>builder()
				.data(candidates)
				.message("Monthly candidates retrieved successfully")
				.build();
	}
	@PostMapping("/monthly-grant")
	public ApiResponse<Void> givePointsToMonthlyCandidates(
			@RequestBody List<Long> candidateIds) {

		pointHistoryService.givePointToMonthlyCandidates(candidateIds);

		return ApiResponse.<Void>builder()
				.message("Points given to monthly candidates successfully")
				.build();
	}

}

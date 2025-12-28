package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.PointsMonthlyCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.PointHistoryResponse;
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
			@RequestBody PointsMonthlyCreationRequest request) {

		pointHistoryService.givePointToMonthlyCandidates(request.getCandidateIds());

		return ApiResponse.<Void>builder()
				.message("Points given to monthly candidates successfully")
				.build();
	}
	@GetMapping("/me")
	public ApiResponse<List<PointHistoryResponse>> getMyPointHistory(PageRequestDTO pageRequestDTO) {
		List<PointHistoryResponse> pointHistories = pointHistoryService.myPointsHistory(pageRequestDTO);
		return ApiResponse.<List<PointHistoryResponse>>builder()
				.data(pointHistories)
				.message("Point history retrieved successfully")
				.build();
	}
	@GetMapping("/me/total-received/month")
	public ApiResponse<Integer> getMyTotalReceivedPointsInMonth() {
		int totalPoints = pointHistoryService.getTotalReceivedPointsInMonth();
		return ApiResponse.<Integer>builder()
				.data(totalPoints)
				.message("Total received points in month retrieved successfully")
				.build();
	}
	@GetMapping("/me/total-received/year")
	public ApiResponse<Integer> getMyTotalReceivedPointsInYear() {
		int totalPoints = pointHistoryService.getTotalReceivedPointsInYear();
		return ApiResponse.<Integer>builder()
				.data(totalPoints)
				.message("Total received points in year retrieved successfully")
				.build();
	}
	@GetMapping("/me/total-points")
	public ApiResponse<Integer> getMyCurrentTotalPoints() {
		int totalPoints = pointHistoryService.getCurrentTotalPoints();
		return ApiResponse.<Integer>builder()
				.data(totalPoints)
				.message("Current total points retrieved successfully")
				.build();
	}

}

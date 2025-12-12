package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.ActivityCreationRequest;
import com.csc12005.hr.DTO.Request.ActivityDetailFilterRequest;
import com.csc12005.hr.DTO.Request.ActivityFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.ActivityDetailResponse;
import com.csc12005.hr.DTO.Response.ActivityResponse;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.Entity.ActivityDetail;
import com.csc12005.hr.Service.ActivityDetailService.Impl.ActivityDetailService;
import com.csc12005.hr.Service.ActivityService.Impl.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/activities")
public class ActivityController {
	private final ActivityService activityService;
	private final ActivityDetailService activityDetailService;
	@PostMapping
	public ApiResponse<ActivityResponse> createActivity(@RequestBody @Valid ActivityCreationRequest request) {
		return ApiResponse.<ActivityResponse>builder()
				.message("Create activity successfully")
				.data(activityService.createActivity(request))
				.build();
	}
	@GetMapping
	public ApiResponse<Page<ActivityDetailResponse>> getActivities(PageRequestDTO pageRequestDTO, ActivityFilterRequest activityFilterRequest) {
		return ApiResponse.<Page<ActivityDetailResponse>>builder()
				.message("Get activities successfully")
				.data(activityService.getActivities(activityFilterRequest, pageRequestDTO))
				.build();
	}
	@PostMapping("/{activityId}/details")
	public ApiResponse<Void> createActivityDetail(@PathVariable Long activityId) {
		activityDetailService.createActivityDetail(activityId);
		return ApiResponse.<Void>builder()
				.message("Create activity detail successfully")
				.build();
	}

}

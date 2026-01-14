package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.DTO.Response.*;
import com.csc12005.hr.Entity.ActivityDetail;
import com.csc12005.hr.Service.ActivityDetailService.IActivityDetailService;
import com.csc12005.hr.Service.ActivityDetailService.Impl.ActivityDetailService;
import com.csc12005.hr.Service.ActivityService.IActivityService;
import com.csc12005.hr.Service.ActivityService.Impl.ActivityService;
import com.csc12005.hr.Utils.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/activities")
@Slf4j
public class ActivityController {
	private final IActivityService activityService;
	private final IActivityDetailService activityDetailService;
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<ActivityResponse> createActivity(@ModelAttribute @Valid ActivityCreationRequest request) {
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
    @PatchMapping("/{activityId}")
    public ApiResponse<ActivityResponse> UpdateActivity(@ModelAttribute @Valid ActivityUpdateRequest request,@PathVariable Long activityId){
        return ApiResponse.<ActivityResponse>builder()
                .data(activityService.updateActivity(request,activityId))
                .message("update success")
                .build();
    }
    @GetMapping("/{activityId}")
    public ApiResponse<Page<ActivityDetailHRResponse>> getActivityParticipants(
            @PathVariable Long activityId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean status,
            PageRequestDTO pageRequestDTO
    ) {
        return ApiResponse.<Page<ActivityDetailHRResponse>>builder()
                .message("Get activity participants successfully")
                .data(
                        activityService.getActivityParticipants(
                                activityId,
                                name,
                                status,
                                pageRequestDTO
                        )
                )
                .build();
    }
    @PostMapping("/import-result")
    public ApiResponse<ImportResult> imPortActivityResult (@RequestParam ("file") MultipartFile file) {
        return ApiResponse.<ImportResult>builder()
		        .message("Import")
		        .data(activityDetailService.importActivityResult(file))
		        .build();
    }

    @PatchMapping("/cancel/{activityId}")
    public ApiResponse<Void> deleteActivityDetail(@PathVariable Long activityId){
        activityDetailService.deleteActivityDetail(activityId);
        return ApiResponse.<Void>builder()
                .message("delete success")
                .build();
    }

}

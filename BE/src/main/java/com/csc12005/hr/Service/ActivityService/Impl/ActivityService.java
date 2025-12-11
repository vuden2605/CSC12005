package com.csc12005.hr.Service.ActivityService.Impl;

import com.csc12005.hr.DTO.Request.ActivityCreationRequest;
import com.csc12005.hr.DTO.Request.ActivityFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.ActivityDetailResponse;
import com.csc12005.hr.DTO.Response.ActivityResponse;
import com.csc12005.hr.Entity.Activity;
import com.csc12005.hr.Mapper.ActivityMapper;
import com.csc12005.hr.Repository.ActivityRepository;
import com.csc12005.hr.Service.ActivityService.IActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityService implements IActivityService {
	private final ActivityRepository activityRepository;
	private final ActivityMapper activityMapper;
	@Override
	public ActivityResponse createActivity(ActivityCreationRequest activityCreationRequest) {
		Activity activity = activityMapper.toActivity(activityCreationRequest);
		return activityMapper.toActivityResponse(activityRepository.save(activity));
	}

	@Override
	public Page<ActivityDetailResponse> getActivities(ActivityFilterRequest activityFilterRequest, PageRequestDTO pageRequestDTO) {
		long employeeId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
		return activityRepository.getActivities(
				employeeId,
				activityFilterRequest.getActivityName(),
				activityFilterRequest.getStartDate(),
				activityFilterRequest.getEndDate(),
				pageRequestDTO.buildPageable()
		);
	}


}

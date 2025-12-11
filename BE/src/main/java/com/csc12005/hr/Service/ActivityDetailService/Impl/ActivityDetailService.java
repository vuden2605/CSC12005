package com.csc12005.hr.Service.ActivityDetailService.Impl;

import com.csc12005.hr.DTO.Request.ActivityDetailFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.ActivityDetailResponse;
import com.csc12005.hr.Entity.ActivityDetail;
import com.csc12005.hr.Mapper.ActivityDetailMapper;
import com.csc12005.hr.Repository.ActivityDetailRepository;
import com.csc12005.hr.Service.ActivityDetailService.IActivityDetailService;
import com.csc12005.hr.Service.ActivityService.IActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityDetailService implements IActivityDetailService {
//	private final ActivityDetailRepository activityDetailRepository;
//	private final ActivityDetailMapper activityDetailMapper;
//	public Page<ActivityDetailResponse> myActivities(ActivityDetailFilterRequest activityDetailFilterRequest, PageRequestDTO pageRequestDTO) {
//		var context = SecurityContextHolder.getContext();
//		long employeeId = Long.parseLong(context.getAuthentication().getName());
//		Page<ActivityDetail>  myActivities = activityDetailRepository.(
//				employeeId,
//				activityDetailFilterRequest.getActivityName(),
//				activityDetailFilterRequest.getStartDate(),
//				activityDetailFilterRequest.getEndDate(),
//				activityDetailFilterRequest.isSuccess(),
//				pageRequestDTO.buildPageable()
//		);
//		return myActivities.map(activityDetailMapper::toActivityDetailResponse);
//	}
}

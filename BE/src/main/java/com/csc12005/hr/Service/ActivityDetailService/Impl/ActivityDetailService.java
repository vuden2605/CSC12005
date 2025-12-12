package com.csc12005.hr.Service.ActivityDetailService.Impl;

import com.csc12005.hr.DTO.Request.ActivityDetailFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.ActivityDetailResponse;
import com.csc12005.hr.Entity.Activity;
import com.csc12005.hr.Entity.ActivityDetail;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.ActivityDetailMapper;
import com.csc12005.hr.Repository.ActivityDetailRepository;
import com.csc12005.hr.Repository.ActivityRepository;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Service.ActivityDetailService.IActivityDetailService;
import com.csc12005.hr.Service.ActivityService.IActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ActivityDetailService implements IActivityDetailService {

	private final ActivityDetailRepository activityDetailRepository;
	private final ActivityRepository activityRepository;
	private final EmployeeRepository EmployeeRepository;
	@Transactional
	@Override
	public void createActivityDetail(Long activityId) {
		Activity activity = activityRepository.findById(activityId)
				.orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));
		var context = SecurityContextHolder.getContext();
		long employeeId = Long.parseLong(context.getAuthentication().getName());
		Employee employee = EmployeeRepository.findById(employeeId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		ActivityDetail activityDetail = ActivityDetail.builder()
				.activity(activity)
				.employee(employee)
				.build();
		activityDetailRepository.save(activityDetail);
		activity.setCount(activity.getCount() + 1);
		activityRepository.save(activity);
	}
}

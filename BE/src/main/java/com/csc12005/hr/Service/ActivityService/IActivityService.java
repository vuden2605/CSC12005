package com.csc12005.hr.Service.ActivityService;

import com.csc12005.hr.DTO.Request.ActivityCreationRequest;
import com.csc12005.hr.DTO.Request.ActivityFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.ActivityResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface IActivityService {
	ActivityResponse createActivity(ActivityCreationRequest activityCreationRequest);
	Page<ActivityResponse> filterActivities(
			ActivityFilterRequest activityFilterRequest,
			PageRequestDTO pageRequestDTO
	);
}

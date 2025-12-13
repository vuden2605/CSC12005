package com.csc12005.hr.Service.ActivityDetailService;

import com.csc12005.hr.DTO.Request.ActivityDetailFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.ActivityDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface IActivityDetailService {
	void createActivityDetail(Long activityId);
}

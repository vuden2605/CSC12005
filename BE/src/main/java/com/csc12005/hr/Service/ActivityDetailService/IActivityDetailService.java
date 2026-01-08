package com.csc12005.hr.Service.ActivityDetailService;

import com.csc12005.hr.DTO.Request.ActivityDetailFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.ActivityDetailResponse;
import com.csc12005.hr.DTO.Response.ImportResult;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface IActivityDetailService {
	void createActivityDetail(Long activityId);
    void deleteActivityDetail(Long activityID);

	ImportResult importActivityResult(MultipartFile file);
}

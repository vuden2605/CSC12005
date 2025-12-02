package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Response.ActivityDetailResponse;
import com.csc12005.hr.Entity.ActivityDetail;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActivityDetailMapper {
	ActivityDetailResponse toActivityDetailResponse(ActivityDetail activityDetail);
}

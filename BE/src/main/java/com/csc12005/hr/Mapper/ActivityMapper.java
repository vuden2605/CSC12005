package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.ActivityCreationRequest;
import com.csc12005.hr.DTO.Response.ActivityResponse;
import com.csc12005.hr.Entity.Activity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActivityMapper {
	Activity toActivity(ActivityCreationRequest request);
	ActivityResponse toActivityResponse(Activity activity);
}

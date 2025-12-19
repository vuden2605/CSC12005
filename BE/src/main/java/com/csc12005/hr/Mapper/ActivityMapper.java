package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.ActivityCreationRequest;
import com.csc12005.hr.DTO.Request.ActivityUpdateRequest;
import com.csc12005.hr.DTO.Response.ActivityResponse;
import com.csc12005.hr.Entity.Activity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ActivityMapper {
	Activity toActivity(ActivityCreationRequest request);
	ActivityResponse toActivityResponse(Activity activity);
    void updateActivity(@MappingTarget Activity activity,
                        ActivityUpdateRequest request);

}

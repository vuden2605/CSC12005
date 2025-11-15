package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.TimeSheetRequestResponse;
import com.csc12005.hr.Entity.TimeSheetRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TimeSheetRequestMapper {
	TimeSheetRequest toTimeSheetRequest(TimeSheetRequestCreationRequest timeSheetRequestCreationRequest);
	TimeSheetRequestResponse toTimeSheetRequestResponse(TimeSheetRequest timeSheetRequest);
}

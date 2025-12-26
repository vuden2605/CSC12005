package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.TimeSheetRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TimeSheetRequestMapper {
	TimeSheetRequest toTimeSheetRequest(RequestCreationRequest timeSheetRequestCreationRequest);
	RequestResponse toTimeSheetRequestResponse(TimeSheetRequest timeSheetRequest);
}

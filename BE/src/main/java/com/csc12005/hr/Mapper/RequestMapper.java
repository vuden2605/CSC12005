package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Request;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RequestMapper {
	Request toRequest(RequestCreationRequest requestCreationRequest);
	RequestResponse toRequestResponse(Request request);
}

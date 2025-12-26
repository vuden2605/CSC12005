package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.WFHRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WFHRequestMapper {
	WFHRequest toWFHRequest(RequestCreationRequest wfhCreationRequest);
	RequestResponse toWFHResponse(WFHRequest wfhRequest);
}

package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.WFHCreationRequest;
import com.csc12005.hr.DTO.Response.WFHResponse;
import com.csc12005.hr.Entity.WFHRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WFHRequestMapper {
	WFHRequest toWFHRequest(WFHCreationRequest wfhCreationRequest);
	WFHResponse toWFHResponse(WFHRequest wfhRequest);
}

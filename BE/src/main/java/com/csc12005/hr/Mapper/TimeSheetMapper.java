package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.TimeSheetCreationRequest;
import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.TimeSheetResponse;
import com.csc12005.hr.Entity.TimeSheet;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface TimeSheetMapper {
	TimeSheet toTimeSheet(TimeSheetCreationRequest timeSheetRequestCreationRequest);
	TimeSheetResponse toTimeSheetResponse(TimeSheet timeSheet);
}

package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.TimeSheetCreationRequest;
import com.csc12005.hr.DTO.Response.TimeSheetResponse;
import com.csc12005.hr.Entity.TimeSheet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TimeSheetMapper {
	TimeSheet toTimeSheet(TimeSheetCreationRequest timeSheetRequestCreationRequest);
	@Mapping(source = "timeSheet.employee.fullName", target = "employeeName")
	@Mapping(source = "timeSheet.employee.employeeCode", target = "employeeCode")
	@Mapping(source = "timeSheet.employee.department.departmentName", target = "departmentName")
	@Mapping(source = "timeSheet.employee.position.positionName", target = "positionName")
	@Mapping(source = "timeSheet.createdBy.fullName", target = "employeeNameCreated")
	@Mapping(source = "timeSheet.createdBy.employeeCode", target = "employeeCodeCreated")
	@Mapping(source = "timeSheet.updatedBy.fullName", target = "employeeNameUpdated")
	@Mapping(source = "timeSheet.updatedBy.employeeCode", target = "employeeCodeUpdated")
	TimeSheetResponse toTimeSheetResponse(TimeSheet timeSheet);
}

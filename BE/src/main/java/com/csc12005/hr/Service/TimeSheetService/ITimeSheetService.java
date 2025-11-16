package com.csc12005.hr.Service.TimeSheetService;

import com.csc12005.hr.DTO.Request.TimeSheetCreationRequest;
import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.TimeSheetResponse;
import com.csc12005.hr.Entity.TimeSheet;
import org.springframework.stereotype.Service;

@Service
public interface ITimeSheetService {
	TimeSheetResponse createTimeSheet(TimeSheetCreationRequest timeSheetRequestCreationRequest);
}

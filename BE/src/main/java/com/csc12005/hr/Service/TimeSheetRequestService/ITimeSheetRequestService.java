package com.csc12005.hr.Service.TimeSheetRequestService;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.TimeSheetRequestResponse;
import org.springframework.stereotype.Service;

@Service
public interface ITimeSheetRequestService {
	TimeSheetRequestResponse createTimeSheetRequest(TimeSheetRequestCreationRequest timeSheetRequestCreationRequest);
	TimeSheetRequestResponse approvedTimeSheetRequest(Long id);
}

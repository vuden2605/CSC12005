package com.csc12005.hr.Service.TimeSheetService;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.TimeSheetCreationRequest;
import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.ImportResult;
import com.csc12005.hr.DTO.Response.TimeSheetResponse;
import com.csc12005.hr.Entity.TimeSheet;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public interface ITimeSheetService {
	ImportResult importTimeSheetExcel(TimeSheetCreationRequest request);
	Page<TimeSheetResponse> myTimeSheets(PageRequestDTO pageRequestDTO, LocalDate fromDate, LocalDate toDate);
}

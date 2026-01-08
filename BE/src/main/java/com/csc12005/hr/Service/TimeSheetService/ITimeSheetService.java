package com.csc12005.hr.Service.TimeSheetService;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.TimeSheetCreationRequest;
import com.csc12005.hr.DTO.Response.ImportResult;
import com.csc12005.hr.DTO.Response.TimeSheetResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface ITimeSheetService {
	ImportResult importTimeSheetExcel(TimeSheetCreationRequest request);
	Page<TimeSheetResponse> myTimeSheets(PageRequestDTO pageRequestDTO, LocalDate fromDate, LocalDate toDate);

	List<TimeSheetResponse> getAllTimeSheets();
}

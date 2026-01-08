package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.TimeSheetCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.ImportResult;
import com.csc12005.hr.DTO.Response.TimeSheetResponse;
import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Service.TimeSheetService.ITimeSheetService;
import com.csc12005.hr.Service.TimeSheetService.Impl.TimeSheetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class TimeSheetController {
	private final ITimeSheetService timeSheetService;
	@PostMapping(
			value = "/timesheets/import",
			consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<ImportResult> importTimeSheet(@ModelAttribute TimeSheetCreationRequest request) throws IOException {
		return ApiResponse.<ImportResult>builder()
				.message("Time sheet imported successfully")
				.data(timeSheetService.importTimeSheetExcel(request))
				.build();
	}
	@GetMapping("/timesheets")
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<List<TimeSheetResponse>> getAllTimeSheets() {
		return ApiResponse.<List<TimeSheetResponse>>builder()
				.message("Time sheets retrieved successfully")
				.data(timeSheetService.getAllTimeSheets())
				.build();
	}
	@GetMapping("/timesheets/my")
	public ApiResponse<Page<TimeSheetResponse>> myTimeSheets(PageRequestDTO pageRequestDTO,
														   @RequestParam(required = false) LocalDate fromDate,
														   @RequestParam(required = false) LocalDate toDate) {
		return ApiResponse.<Page<TimeSheetResponse>>builder()
				.message("My time sheets retrieved successfully")
				.data(timeSheetService.myTimeSheets(pageRequestDTO, fromDate, toDate))
				.build();
	}

}

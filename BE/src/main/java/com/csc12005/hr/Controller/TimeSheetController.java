package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.TimeSheetCreationRequest;
import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.ImportResult;
import com.csc12005.hr.DTO.Response.TimeSheetResponse;
import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Service.TimeSheetService.Impl.TimeSheetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class TimeSheetController {
	private final TimeSheetService timeSheetService;
	@PostMapping("/timesheets/import" )
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<ImportResult> importTimeSheet(@ModelAttribute TimeSheetCreationRequest request) throws IOException {
		return ApiResponse.<ImportResult>builder()
				.message("Time sheet imported successfully")
				.data(timeSheetService.importTimeSheetExcel(request))
				.build();
	}
}

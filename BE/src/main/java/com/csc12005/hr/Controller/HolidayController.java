package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.HolidayFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.PublicHolidayCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.ImportResult;
import com.csc12005.hr.DTO.Response.PublicHolidayResponse;
import com.csc12005.hr.Service.PublicHolidayService.IPublicHolidayService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/holidays")
public class HolidayController {
	private final IPublicHolidayService publicHolidayService;
	@PostMapping
	public ApiResponse<PublicHolidayResponse> createPublicHolidays(@RequestBody PublicHolidayCreationRequest request) {
		PublicHolidayResponse response = publicHolidayService.createPublicHoliday(request);
		return ApiResponse.<PublicHolidayResponse>builder()
				.data(response)
				.message("Public holidays for the current year have been created successfully.")
				.build();
	}
	@GetMapping("/{id}")
	public ApiResponse<PublicHolidayResponse> getPublicHolidayById(@PathVariable Long id) {
		PublicHolidayResponse response = publicHolidayService.getPublicHolidayById(id);
		return ApiResponse.<PublicHolidayResponse>builder()
				.data(response)
				.message("Public holiday retrieved successfully.")
				.build();
	}
	@GetMapping("/filter")
	public ApiResponse<Page<PublicHolidayResponse>> getPublicHolidaysByYearAndMonth(
			HolidayFilterRequest filterRequest,
			PageRequestDTO pageRequestDTO) {
		Page<PublicHolidayResponse> response = publicHolidayService.filterHolidays(filterRequest, pageRequestDTO);
		return ApiResponse.<Page<PublicHolidayResponse>>builder()
				.data(response)
				.message("Public holidays retrieved successfully.")
				.build();
	}
	@PostMapping("/import")
	public ApiResponse<ImportResult> importPublicHolidays(@RequestParam("file") MultipartFile file) {
		ImportResult result = publicHolidayService.importHolidays(file);
		return ApiResponse.<ImportResult>builder()
				.data(result)
				.message("Public holidays imported successfully.")
				.build();
	}
}

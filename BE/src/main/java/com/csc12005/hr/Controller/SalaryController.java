package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.SalaryResponse;
import com.csc12005.hr.Service.MonthlyAttendanceSummaryService.impl.MonthlyAttendanceSummaryService;
import com.csc12005.hr.Service.SalaryService.Impl.SalaryService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequiredArgsConstructor
@RequestMapping("/salaries")
public class SalaryController {
    private final SalaryService salaryService;
    private final MonthlyAttendanceSummaryService monthlyAttendanceSummaryService;
    @PostMapping
    public ApiResponse<Void> createAll(@RequestBody SalaryCreationRequest request)
    {
        salaryService.generatePayroll(request.getMonth(), request.getYear());
        return ApiResponse.<Void>builder()
                .message("create success")
                .build();
    }
    @GetMapping("/search")
    public ApiResponse<Page<SalaryResponse>> getAll(SalaryFilterRequest request, PageRequestDTO pageRequestDTO){
        return ApiResponse.<Page<SalaryResponse>> builder()
                .message("search success")
                .data(salaryService.getAll(request,pageRequestDTO))
                .build();
    }
    @GetMapping("/my")
    public ApiResponse<Page<SalaryResponse>> mySalaries(
            MySalaryFilterRequest request,PageRequestDTO pageRequestDTO
    ) {
        return ApiResponse.<Page<SalaryResponse>>builder()
                .data(salaryService.getMySalaries(request, pageRequestDTO))
                .message("Get my salaries successfully")
                .build();
    }
    @PostMapping("/update-status")
    public ApiResponse<Void> paySalary(
		    @RequestBody PaySalaryRequest request
		    ) {
        salaryService.updateStatus(request.getMonth(), request.getYear(), request.getStatus());
        return ApiResponse.<Void>builder()
                .message("Pay salary successfully")
                .build();
    }
//    @PostMapping("/monthly-summary")
//    public ApiResponse<Void> createMonthlyAttendanceSummary(
//			@RequestBody MonthlyAttendanceSummaryCreationRequest request
//	) {
//		monthlyAttendanceSummaryService.createMonthlyAttendanceSummary(request);
//		return ApiResponse.<Void>builder()
//				.message("Create monthly attendance summary successfully")
//				.build();
//	}
	@GetMapping("/qr/{salaryId}")
	public ApiResponse<String> getSalaryPaymentQRCode(
			@PathVariable Long salaryId
	) {
		String qrCodeUrl = salaryService.generateQRPayRoll(salaryId);
		return ApiResponse.<String>builder()
				.data(qrCodeUrl)
				.message("Get salary payment QR code successfully")
				.build();
	}
}

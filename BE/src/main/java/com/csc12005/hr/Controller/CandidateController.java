package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.CandidateResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.ImportResult;
import com.csc12005.hr.Service.CandidateService.ICandidateService;
import com.csc12005.hr.Service.CandidateService.impl.CandidateService;
import com.csc12005.hr.Service.EmployeeService.impl.EmployeeService;
import com.csc12005.hr.Utils.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/candidates")
public class CandidateController {
	private final ICandidateService candidateService;
    @PostMapping("")
    public ApiResponse<CandidateResponse> createCandidate( @ModelAttribute @Valid CandidateCreationRequest request)
    {
        return ApiResponse.<CandidateResponse>builder()
                .data(candidateService.createCandidate(request))
                .message("create success")
                .build();
    }
    //cho người phỏng vấn đánh giá-> cập nhật trạng thái ứng viên
    @PostMapping("/evaluate/{id}")
    public ApiResponse<Void> evaluateCandidate(
            @PathVariable Long id,
            @RequestBody CandidateEvaluationRequest request
    ) {
        candidateService.evaluateCandidate(id, request);
        return ApiResponse.<Void>builder()
                .message("Evaluate candidate successfully")
                .build();
    }
    // Cho hr đánh giá pass/fail-> cập nhật trạng thái ứng viên
    @PostMapping("/interview-result/{id}")
    public ApiResponse<Void> interviewResult(
            @PathVariable Long id,
            @RequestParam boolean passed
    ) {
        candidateService.markInterviewed(id, passed);
        return ApiResponse.<Void>builder()
                .message("Set interview result successfully")
                .build();
    }
    //hr update thông tin ứng viên( không gồm đánh giá),chỉ update nếu chưa phỏng vấn
    @PatchMapping("/{id}")
    public ApiResponse<CandidateResponse> updateCandidate(
            @PathVariable Long id,
            @ModelAttribute @Valid CandidateUpdateRequest request)
    {
        return ApiResponse.<CandidateResponse>builder()
                .data(candidateService.updateCandidate(id,request))
                .message("update success")
                .build();
    }
    //Người phỏng vấn cập nhật kết quả phỏng vấn( rule: khi status = "interviewed" mới được cập nhật)
    @PatchMapping("/update-evaluation/{id}")
    public ApiResponse<CandidateResponse> updateEvaluation(
            @PathVariable Long id,
            @RequestBody CandidateEvaluationRequest request) {
        candidateService.UpdateEvaluateCandidate(id, request);
        return ApiResponse.<CandidateResponse>builder()
                .message("update evaluation success")
                .build();
    }
    // filter candidate
    @GetMapping("")
    public ApiResponse<Page<CandidateResponse>> filterCandidates(
            CandidateFilterRequest request,PageRequestDTO pageRequestDTO
    ) {
        return ApiResponse.<Page<CandidateResponse>>builder()
                .data(candidateService.filterCandidates(request,pageRequestDTO))
                .message("Filter candidates successfully")
                .build();
    }
    // get candidate by id
    @GetMapping("/{id}")
    public ApiResponse<CandidateResponse> getCandidateById(
            @PathVariable Long id
    ) {
        return ApiResponse.<CandidateResponse>builder()
                .data(candidateService.getCandidateById(id))
                .message("Get candidate by id successfully")
                .build(); }
    // chuyển ứng viên thành nhân viên
    @PostMapping("/hire/{id}")
    public ApiResponse<EmployeeResponse> hireCandidate(
            @PathVariable Long id
    ) {
        return ApiResponse.<EmployeeResponse>builder()
                .data(candidateService.hireCandidate(id))
                .message("Hire candidate successfully")
                .build();
    }


}

package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.CandidateResponse;
import com.csc12005.hr.DTO.Response.ScheduleResponse;
import com.csc12005.hr.Service.CandidateService.impl.CandidateService;
import com.csc12005.hr.Service.ScheduleService.IScheduleService;
import com.csc12005.hr.Service.ScheduleService.Impl.ScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/schedules")
public class ScheduleController {
	private final IScheduleService scheduleService;
    @PostMapping("")
    public ApiResponse<ScheduleResponse> createSchedule(@Valid @RequestBody ScheduleCreationRequest request)
    {
        return ApiResponse.<ScheduleResponse>builder()
                .data(scheduleService.createSchedule(request))
                .message("create success")
                .build();
    }
    @PostMapping("/add-candidates")
    public ApiResponse<Void> addCandidatesToSchedule(
            @Valid @RequestBody AddCandidatesToScheduleRequest request
    ) {
        scheduleService.addCandidatesToSchedule(
                request.getScheduleId(),
                request.getCandidateIds()
        );

        return ApiResponse.<Void>builder()
                .message("Add candidates to schedule successfully")
                .build();
    }
    @PatchMapping("/{scheduleId}" )
    public ApiResponse<ScheduleResponse> updateSchedule(
            @PathVariable Long scheduleId,
            @Valid @RequestBody ScheduleUpdateRequest scheduleUpdateRequest
    ) {
        return ApiResponse.<ScheduleResponse>builder()
                .data(scheduleService.updateSchedule(scheduleId, scheduleUpdateRequest))
                .message("Update schedule successfully")
                .build();
    }
    @DeleteMapping("/candidates/{candidateId}")
    public ApiResponse<Void> removeCandidateFromSchedule(
            @PathVariable Long candidateId
    ) {
        scheduleService.removeCandidateFromSchedule(candidateId);
        return ApiResponse.<Void>builder()
                .message("Remove candidate from schedule successfully")
                .build();
    }
    @DeleteMapping("/{scheduleId}")
    public ApiResponse<Void> deleteSchedule(
            @PathVariable Long scheduleId
    ) {
        scheduleService.cancelSchedule(scheduleId);
        return ApiResponse.<Void>builder()
                .message("Cancel schedule successfully")
                .build();   }
    @GetMapping
    public ApiResponse<Page<ScheduleResponse>> filterSchedules(
            ScheduleFilterRequest request,
            PageRequestDTO pageRequestDTO
    ) {
        return ApiResponse.<Page<ScheduleResponse>>builder()
                .data(scheduleService.filterSchedules(request, pageRequestDTO))
                .message("Filter schedules successfully")
                .build();
    }
    @GetMapping("/{scheduleId}")
    public ApiResponse<ScheduleResponse> getScheduleById(
            @PathVariable Long scheduleId
    ) {
        return ApiResponse.<ScheduleResponse>builder()
                .data(scheduleService.getScheduleById(scheduleId))
                .message("Get schedule by id successfully")
                .build();
    }
    // filter giống filterSchedules nhưng chỉ lấy lịch của user đăng nhập, không truyền positionId
    @GetMapping("/my-schedules")
    public ApiResponse<Page<ScheduleResponse>> mySchedules(
            ScheduleFilterRequest request,
            PageRequestDTO pageRequestDTO)
    {
        return ApiResponse.<Page<ScheduleResponse>>builder()
                .data(scheduleService.mySchedules(request, pageRequestDTO))
                .message("Get my schedules successfully")
                .build();
    }

}

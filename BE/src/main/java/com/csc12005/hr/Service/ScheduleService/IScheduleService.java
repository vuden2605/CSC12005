package com.csc12005.hr.Service.ScheduleService;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.ScheduleCreationRequest;
import com.csc12005.hr.DTO.Request.ScheduleFilterRequest;
import com.csc12005.hr.DTO.Request.ScheduleUpdateRequest;
import com.csc12005.hr.DTO.Response.ScheduleResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IScheduleService {
    public ScheduleResponse createSchedule(ScheduleCreationRequest scheduleCreationRequest);
    public void addCandidatesToSchedule(
            Long scheduleId,
            List<Long> candidateIds
    );
    public ScheduleResponse updateSchedule(
            Long scheduleId,
            ScheduleUpdateRequest scheduleUpdateRequest
    );
    public void removeCandidateFromSchedule(Long candidateId,String reason);
    public void cancelSchedule(Long scheduleId, String reason);
    public Page<ScheduleResponse> filterSchedules(
            ScheduleFilterRequest request,
            PageRequestDTO pageRequestDTO
    );
    public ScheduleResponse getScheduleById(Long scheduleId);
    public Page<ScheduleResponse> mySchedules(
            ScheduleFilterRequest request,
            PageRequestDTO pageRequestDTO
    );
}

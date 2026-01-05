package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.CandidateCreationRequest;
import com.csc12005.hr.DTO.Request.ScheduleCreationRequest;
import com.csc12005.hr.DTO.Response.CandidateResponse;
import com.csc12005.hr.DTO.Response.ScheduleResponse;
import com.csc12005.hr.Entity.Candidate;
import com.csc12005.hr.Entity.Schedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ScheduleMapper {
    @Mapping(target = "interviewer", ignore = true)
    Schedule toSchedule(ScheduleCreationRequest scheduleCreationRequest);
    @Mapping(target = "interviewer", source = "interviewer")
    ScheduleResponse toScheduleResponse(Schedule schedule);

}

package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.CandidateCreationRequest;
import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Request.EmployeeHRUpdateRequest;
import com.csc12005.hr.DTO.Response.CandidateResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.Entity.Candidate;
import com.csc12005.hr.Entity.Employee;
import org.mapstruct.*;
@Mapper(componentModel = "spring")
public interface CandidateMapper {
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "cv", ignore = true)
    Candidate toCandidate(CandidateCreationRequest candidateCreationRequest);
    @Mapping(target = "position", source = "position")
    @Mapping(target = "schedule", ignore = true)
    CandidateResponse toCandidateResponse(Candidate candidate);

    @AfterMapping
    default void mapScheduleIfNotNull(@MappingTarget CandidateResponse response, Candidate candidate) {
        if (candidate.getSchedule() != null) {
            response.setSchedule(candidate.getSchedule());
        }
    }

}

package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Enums.CandidateStatus;
import com.csc12005.hr.Enums.ScheduleTimeSlot;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ScheduleResponse {

    private Long id;
    private String location;
    private ScheduleTimeSlot timeSlot;
    private LocalDate date;
    private EmployeeResponse interviewer;
    private PositionResponse position;

}

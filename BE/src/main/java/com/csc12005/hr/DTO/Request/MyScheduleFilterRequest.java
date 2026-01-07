package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.ScheduleStatus;
import com.csc12005.hr.Enums.ScheduleTimeSlot;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyScheduleFilterRequest {
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private ScheduleTimeSlot timeSlot;
    private ScheduleStatus status;
    private String location;
}

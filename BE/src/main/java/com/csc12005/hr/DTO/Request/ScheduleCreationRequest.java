package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.ScheduleTimeSlot;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScheduleCreationRequest {
    @NotNull(message = "REQUIRED_SCHEDULE_DATE")
    private LocalDate date;
    @NotNull(message = "REQUIRED_SCHEDULE_TIME_SLOT")
    private ScheduleTimeSlot timeSlot;
    @NotBlank(message = "REQUIRED_SCHEDULE_LOCATION")
    private String location;
    @NotNull(message = "REQUIRED_POSITION_ID")
    private Long positionId;
}

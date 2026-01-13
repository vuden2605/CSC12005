package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddCandidatesToScheduleRequest {
    @NotNull(message = "REQUIRED_SCHEDULE_ID")
    private Long scheduleId;

    @NotEmpty(message = "REQUIRED_CANDIDATE_IDS")
    private List<Long> candidateIds;
}

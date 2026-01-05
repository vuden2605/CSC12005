package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.CandidateStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateFilterRequest {
    private String fullName;
    private String email;
    private Long positionId;
    private String status;
}

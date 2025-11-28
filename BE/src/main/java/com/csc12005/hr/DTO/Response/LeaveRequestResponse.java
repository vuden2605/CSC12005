package com.csc12005.hr.DTO.Response;

import lombok.Data;
import java.time.LocalDateTime;

import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Enums.RequestType;
import lombok.Builder;

@Data
@Builder
public class LeaveRequestResponse {

    private Long id;
    private Long employeeId;
    private RequestType requestType;
    private String reason;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private RequestStatus status;
    private String approver;
    private LocalDateTime createdAt;
}

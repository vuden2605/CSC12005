package com.csc12005.hr.DTO.Response;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class LeaveRequestListItemResponse {

    private Long requestId;

    private String employeeName;

    private String leaveTypeName;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer totalDays;

    private String reason;

    private String status;

    private LocalDateTime createdAt;

    private String attachment;
}

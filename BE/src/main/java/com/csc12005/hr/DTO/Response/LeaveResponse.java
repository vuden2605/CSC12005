package com.csc12005.hr.DTO.Response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LeaveResponse {

    private Integer requestId;
    private Integer leaveTypeId;
    private String leaveTypeName;
    private String status;
    private String attachment;
    private LocalDateTime createAt;
}
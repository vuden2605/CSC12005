package com.csc12005.hr.Entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_requests")
@Data
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer requestId;
    private Integer employeeId;
    private Integer leaveTypeId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String reason;
    private String attachmentUrl;
    private String status;
    private LocalDateTime createAt;
}
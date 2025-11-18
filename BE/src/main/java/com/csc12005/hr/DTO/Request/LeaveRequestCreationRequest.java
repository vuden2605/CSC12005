package com.csc12005.hr.DTO.Request;

import lombok.Data;
import java.time.LocalDateTime;
import org.springframework.web.multipart.MultipartFile;

@Data
public class LeaveRequestCreationRequest {

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String reason;
    private MultipartFile attachment;
}
package com.csc12005.hr.DTO.Request;

import lombok.Data;
// import java.time.LocalDateTime;
// import org.springframework.web.multipart.MultipartFile;


@Data
public class LeaveRequestCreationRequest {
    private String approver;
    private boolean approve;
}

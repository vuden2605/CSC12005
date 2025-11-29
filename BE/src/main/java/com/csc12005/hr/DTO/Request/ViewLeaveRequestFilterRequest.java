package com.csc12005.hr.DTO.Request;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class ViewLeaveRequestFilterRequest {

    private String status; 
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private Integer page = 1;

    private Integer pageSize = 10;
}

package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Entity.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryFilterRequest {
    private Boolean status;
    private Long month;
    private Long year;
	private String employeeName;
}

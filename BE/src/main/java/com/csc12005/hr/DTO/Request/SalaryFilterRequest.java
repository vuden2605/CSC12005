package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Salary;
import com.csc12005.hr.Enums.SalaryStatus;
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
    private SalaryStatus status;
    private Long month;
    private Long year;
	private String employeeName;
}

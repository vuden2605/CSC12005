package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.SalaryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MySalaryFilterRequest {
    private SalaryStatus status;
    private int month;
    private int year;
}

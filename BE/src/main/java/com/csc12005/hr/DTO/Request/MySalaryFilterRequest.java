package com.csc12005.hr.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MySalaryFilterRequest {
    private Boolean status;
    private Long month;
    private Long year;
}

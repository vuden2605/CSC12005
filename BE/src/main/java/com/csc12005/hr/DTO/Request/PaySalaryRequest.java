package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.SalaryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaySalaryRequest {
	private Long month;
	private Long year;
	private SalaryStatus status;
}

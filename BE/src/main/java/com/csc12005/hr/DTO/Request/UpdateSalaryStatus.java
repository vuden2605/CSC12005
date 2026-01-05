package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.SalaryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSalaryStatus {
	private List<Long> salaryIds;
	private SalaryStatus status;
}

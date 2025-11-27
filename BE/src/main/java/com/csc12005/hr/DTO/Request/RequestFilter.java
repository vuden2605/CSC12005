package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.RequestType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestFilter {
	private RequestType requestType;
	private LocalDateTime startDate;
	private LocalDateTime endDate;
	private String status;
}

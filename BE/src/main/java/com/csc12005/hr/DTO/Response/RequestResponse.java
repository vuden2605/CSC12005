package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Enums.RequestType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.SuperBuilder;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RequestResponse {
	private Long id;
	private RequestType requestType;
	private RequestStatus status;
	private String requestAttachment;
	private String reason;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private EmployeeResponse employee;
	private LocalTime checkInNew;
	private LocalTime checkOutNew;
	private LocalDate workDate;
	private LocalDate startDate;
	private LocalDate endDate;
}

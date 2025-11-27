package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Enums.RequestStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.SuperBuilder;


import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RequestResponse {
	private Long id;
	private String requestType;
	private RequestStatus status;
	private String requestAttachment;
	private String reason;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private EmployeeResponse employee;
}

package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Enums.PointExchangeStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PointExchangeResponse {
	private Long id;
	private String employeeName;
	private String employeeCode;
	private Integer pointUsed;
	private Long exchangeValue;
	private PointExchangeStatus status;
	private String note;
	private LocalDateTime requestedAt;
	private LocalDateTime approvedAt;
	private LocalDateTime completedAt;
	private LocalDateTime rejectedAt;
}

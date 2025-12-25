package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Enums.PointReasonType;
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
public class PointHistoryResponse {
	private Long id;
	private String employeeName;
	private String employeeCode;
	private Long pointChange;
	private PointReasonType reasonType;
	private Long referenceId;
	private String description;
	private LocalDateTime createdAt;
}


package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.TimeSheetStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSheetRequestCreationRequest {
	private String requestAttachment;
	private String reason;
	private LocalDateTime checkInNew;
	private LocalDateTime checkOutNew;
}

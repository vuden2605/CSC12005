package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Enums.TimeSheetStatus;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class TimeSheetRequestResponse extends RequestResponse{;
	private LocalTime checkInNew;
	private LocalTime checkOutNew;
}

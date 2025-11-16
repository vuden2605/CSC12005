package com.csc12005.hr.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "timesheet_requests")
@PrimaryKeyJoinColumn(name = "request_id")
public class TimeSheetRequest extends Request {
	private LocalTime checkInNew;
	private LocalTime checkOutNew;
	@OneToOne
	@JoinColumn(name = "timesheet_id")
	private TimeSheet timeSheet;
}

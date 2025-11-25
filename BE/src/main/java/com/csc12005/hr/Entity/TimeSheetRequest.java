package com.csc12005.hr.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "timesheet_requests")
public class TimeSheetRequest extends Request {
	private LocalTime checkInNew;
	private LocalTime checkOutNew;
	private LocalDate workDate;
}

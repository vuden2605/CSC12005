package com.csc12005.hr.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "timesheet_requests")
@PrimaryKeyJoinColumn(name = "request_id")
public class TimeSheetRequest extends Request {
	private LocalDateTime checkInNew;
	private LocalDateTime checkOutNew;
}

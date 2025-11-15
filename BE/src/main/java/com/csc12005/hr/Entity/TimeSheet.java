package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.TimeSheetStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "timesheets")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSheet {
	@Id
	private Long timesheetId;
	private LocalDate workDate;
	private LocalDateTime checkIn;
	private LocalDateTime checkOut;
	private TimeSheetStatus status;
	@ManyToOne
	@JoinColumn(name = "employee_id")
	private Employee employee;
}

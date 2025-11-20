package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.TimeSheetStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "timesheets",
		uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "work_date"}))
public class TimeSheet {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long timesheetId;
	private LocalDate workDate;
	private LocalTime checkIn;
	private LocalTime checkOut;
	@Enumerated(EnumType.STRING)
	private TimeSheetStatus status;
	@ManyToOne
	@JoinColumn(name = "employee_id")
	private Employee employee;
}

package com.csc12005.hr.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "leave_types")
public class LeaveType {
	private Long leaveTypeId;
	private String leaveTypeName;
	private Long allow_days_per_year;
	private String description;
}

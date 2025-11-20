package com.csc12005.hr.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
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
@Table(name = "leave_details")
public class LeaveDetail {
	private Long leaveDetailId;
	private Long usedDays;
	private Long remainingDays;
	@OneToOne
	@JoinColumn(name = "leave_type_id")
	private LeaveType leaveType;
	@OneToOne
	@JoinColumn(name = "employee_id")
	private Employee employee;
}

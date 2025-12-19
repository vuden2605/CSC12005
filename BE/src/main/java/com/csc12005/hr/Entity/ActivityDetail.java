package com.csc12005.hr.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "activity_details")
public class ActivityDetail {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "activity_id")
	private Activity activity;
	@ManyToOne
	@JoinColumn(name = "employee_id")
	private Employee employee;
	private Long score;
	@Builder.Default
	private Boolean isSuccess = false;
}

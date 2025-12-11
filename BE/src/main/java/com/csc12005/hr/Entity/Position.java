package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.EmployeeRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "positions")
public class Position {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String positionName;
	private String positionCode;
	private Long salaryRangeMin;
	private Long salaryRangeMax;
	private Long baseWorkTimes;
	private Long point;
	@Enumerated(EnumType.STRING)
	@Builder.Default
	private EmployeeRole role = EmployeeRole.EMP;
	@ManyToOne
	@JoinColumn(name = "department_id")
	private Department department;
}

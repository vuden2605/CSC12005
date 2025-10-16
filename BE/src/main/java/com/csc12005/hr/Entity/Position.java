package com.csc12005.hr.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "positions")
public class Position {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long positionId;
	private String positionName;
	private String positionCode;
	private Long salaryRangeMin;
	private Long salaryRangeMax;
	private Long baseWorkTimes;
	private Long point;
}

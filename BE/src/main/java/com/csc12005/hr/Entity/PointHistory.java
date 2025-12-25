package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.PointReasonType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "point_histories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee;

	private Long pointChange;

	@Enumerated(EnumType.STRING)
	private PointReasonType reasonType;

	private Long referenceId;

	private String description;

	@CreationTimestamp
	private LocalDateTime createdAt;
}


package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.PointExchangeStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "point_exchanges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointExchange {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee;

	private Long pointUsed;

	private Long exchangeValue;

	@Enumerated(EnumType.STRING)
	private PointExchangeStatus status;

	@Version
	private Long version;
	@CreationTimestamp
	private LocalDateTime requestedAt;
	private LocalDateTime approvedAt;
	private LocalDateTime completedAt;
	private LocalDateTime rejectedAt;
}


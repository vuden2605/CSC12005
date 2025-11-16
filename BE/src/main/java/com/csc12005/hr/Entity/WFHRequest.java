package com.csc12005.hr.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "wfh_requests")
@PrimaryKeyJoinColumn(name = "wfh_id")
public class WFHRequest extends Request{
	private LocalDateTime startDate;
	private LocalDateTime endDate;
}

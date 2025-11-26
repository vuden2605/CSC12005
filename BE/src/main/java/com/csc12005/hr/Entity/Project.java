package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.ProjectPriority;
import com.csc12005.hr.Enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "projects")
public class Project {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String projectCode;
	private String projectName;
	private String description;
	private LocalDate startDate;
	private LocalDate endDate;
	@Builder.Default
	@Enumerated(EnumType.STRING)
	private ProjectStatus status = ProjectStatus.Pending;
	@Enumerated(EnumType.STRING)
	private ProjectPriority priority;
	@CreationTimestamp
	private LocalDateTime createdAt;
	@UpdateTimestamp
	private LocalDateTime updatedAt;
	private Double progress_percentage;
	@ManyToOne
	@JoinColumn(name = "department_id")
	private Department department;
	@ManyToOne
	@JoinColumn(name = "leader_id")
	private Employee leader;
}

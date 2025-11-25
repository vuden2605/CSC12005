package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.TaskStatus;
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
@Table(name = "tasks")
public class Task {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String taskName;
	private String description;
	private Long priority;
	private TaskStatus status;
	private Long estimatedTime;
	private Long timeSpent;
	private LocalDate startDate;
	private LocalDate dueDate;
	private LocalDate completedDate;
	@CreationTimestamp
	private LocalDateTime createdAt;
	@UpdateTimestamp
	private LocalDateTime updatedAt;
	@ManyToOne
	private Project project;
	@ManyToOne
	@JoinColumn(name = "assigned_to")
	private Employee assignedTo;
}

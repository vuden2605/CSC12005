package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.TaskStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "task_reviews")
public class TaskReview {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "task_id")
	private Task task;
	@ManyToOne
	@JoinColumn(name = "reviewed_by")
	private Employee reviewedBy;
	private String comments;
	private LocalDate reviewDate;
	private TaskStatus status;
}

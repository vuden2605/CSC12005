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
@Table(name = "task_attachments")
public class TaskAttachment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String filePath;
	private String fileType;
	@ManyToOne
	@JoinColumn(name = "task_id")
	private Task task;
	@ManyToOne
	@JoinColumn(name = "uploaded_by")
	private Employee uploadedBy;
}

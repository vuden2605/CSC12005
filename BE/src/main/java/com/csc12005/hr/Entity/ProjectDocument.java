package com.csc12005.hr.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "project_documents")
public class ProjectDocument {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String documentName;
	private String filePath;
	private String fileType;
	@CreationTimestamp
	private LocalDateTime uploadedAt;
	@ManyToOne
	@JoinColumn(name = "project_id")
	private Project project;
	@ManyToOne
	@JoinColumn(name = "uploaded_by")
	private Employee uploadedBy;

}

package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Project;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDocumentResponse {
	private Long id;
	private String documentName;
	private String filePath;
	private String fileType;
	private LocalDateTime uploadedAt;
	private Long projectId;
	private EmployeeResponse uploadedBy;
}

package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Project;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDocumentCreationRequest {
	private String documentName;
	private MultipartFile file;
	private String fileType;
}

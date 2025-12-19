package com.csc12005.hr.Service.ProjectDocumentService.Impl;

import com.csc12005.hr.DTO.Request.ProjectDocumentCreationRequest;
import com.csc12005.hr.DTO.Response.ProjectDocumentResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Project;
import com.csc12005.hr.Entity.ProjectDocument;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.ProjectDocumentMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.ProjectDocumentRepository;
import com.csc12005.hr.Repository.ProjectRepository;
import com.csc12005.hr.Service.ProjectDocumentService.IProjectDocumentService;
import com.csc12005.hr.Service.S3Service.Impl.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectDocumentService implements IProjectDocumentService {
	private final ProjectDocumentMapper projectDocumentMapper;
	private final ProjectDocumentRepository projectDocumentRepository;
	private final ProjectRepository projectRepository;
	private final S3Service s3Service;
	private final EmployeeRepository employeeRepository;
	@Override
	public ProjectDocumentResponse createProjectDocument(Long projectId, ProjectDocumentCreationRequest projectDocumentCreationRequest) {
		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new AppException(ErrorCode.PROJECT_NOT_FOUND));
		String filePath = s3Service.uploadFile(projectDocumentCreationRequest.getFile());
		var context = SecurityContextHolder.getContext();
		long uploadedById = Long.parseLong(context.getAuthentication().getName());
		Employee uploadedBy = employeeRepository.findById(uploadedById)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		ProjectDocument document = ProjectDocument.builder()
				.documentName(projectDocumentCreationRequest.getDocumentName())
				.filePath(filePath)
				.fileType(projectDocumentCreationRequest.getFile().getContentType())
				.uploadedBy(uploadedBy)
				.project(project)
				.build();
		ProjectDocument savedDocument = projectDocumentRepository.save(document);
		return projectDocumentMapper.toProjectDocumentResponse(savedDocument);
	}
}

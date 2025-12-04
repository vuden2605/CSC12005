package com.csc12005.hr.Service.ProjectDocumentService;

import com.csc12005.hr.DTO.Request.ProjectDocumentCreationRequest;
import com.csc12005.hr.DTO.Response.ProjectDocumentResponse;
import org.springframework.stereotype.Service;

@Service
public interface IProjectDocumentService {
	ProjectDocumentResponse createProjectDocument(Long projectId, ProjectDocumentCreationRequest projectDocumentCreationRequest);
}

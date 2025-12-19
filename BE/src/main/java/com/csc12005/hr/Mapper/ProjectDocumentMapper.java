package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.ProjectDocumentCreationRequest;
import com.csc12005.hr.DTO.Response.ProjectDocumentResponse;
import com.csc12005.hr.Entity.ProjectDocument;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectDocumentMapper {
	ProjectDocument toProjectDocument(ProjectDocumentCreationRequest projectDocumentCreationRequest);
	@Mapping(source = "project.id", target = "projectId")
	ProjectDocumentResponse toProjectDocumentResponse(ProjectDocument projectDocument);
}

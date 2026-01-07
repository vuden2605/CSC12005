package com.csc12005.hr.Service.CandidateService;


import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.DTO.Response.CandidateResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ICandidateService {
    public CandidateResponse createCandidate(CandidateCreationRequest request);
    public void evaluateCandidate(Long candidateId, CandidateEvaluationRequest request);
    public void markInterviewed(Long candidateId, boolean passed);
    public CandidateResponse updateCandidate(Long candidateId, CandidateUpdateRequest request);
    public void UpdateEvaluateCandidate(Long candidateId, CandidateEvaluationRequest request);
    public Page<CandidateResponse> filterCandidates(CandidateFilterRequest request, PageRequestDTO pageRequestDTO);
    public CandidateResponse getCandidateById(Long candidateId);
    public EmployeeResponse hireCandidate(Long candidateId);
}

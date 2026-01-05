package com.csc12005.hr.Service.CandidateService.impl;

import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.DTO.Response.CandidateResponse;
import com.csc12005.hr.Entity.Candidate;
import com.csc12005.hr.Entity.Position;
import com.csc12005.hr.Entity.Schedule;
import com.csc12005.hr.Enums.CandidateStatus;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.CandidateMapper;
import com.csc12005.hr.Repository.CandidateRepository;
import com.csc12005.hr.Repository.PositionRepository;
import com.csc12005.hr.Service.CandidateService.ICandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateService implements ICandidateService {
    private final CandidateRepository candidateRepository;
    private final CandidateMapper candidateMapper;
    private final PositionRepository positionRepository;
    public CandidateResponse createCandidate(CandidateCreationRequest request){
        Candidate candidate= candidateMapper.toCandidate(request);
        Position position= positionRepository.findById(request.getPositionId()).orElseThrow(()-> new AppException(ErrorCode.POSITION_NOT_FOUND));
        candidate.setPosition(position);
        Candidate savedCandidate = candidateRepository.save(candidate);
        return candidateMapper.toCandidateResponse(savedCandidate);
    }
    @Transactional
    public void evaluateCandidate(Long candidateId, CandidateEvaluationRequest request) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new AppException(ErrorCode.CANDIDATE_NOT_FOUND));

        candidate.setRatingTechnical(request.getRatingTechnical());
        candidate.setRatingCommunication(request.getRatingCommunication());
        candidate.setRatingProblemSolving(request.getRatingProblemSolving());
        candidate.setRatingExperience(request.getRatingExperience());
        candidate.setRatingCultureFit(request.getRatingCultureFit());
        candidate.setFeedback(request.getFeedback());

        BigDecimal avg = BigDecimal.valueOf(
                (request.getRatingTechnical()
                        + request.getRatingCommunication()
                        + request.getRatingProblemSolving()
                        + request.getRatingExperience()
                        + request.getRatingCultureFit()) / 5.0
        );

        candidate.setRatingAverage(avg);
        candidate.transitionTo(CandidateStatus.INTERVIEWED);
        candidateRepository.save(candidate);
        // đánh giá xong thì gọi thử xem đã phỏng vấn hết chưa-> cập nhật trạng thái lịch là đã xong
        Schedule schedule = candidate.getSchedule();
        if (schedule != null) {
            schedule.tryComplete();
        }
    }
    public void UpdateEvaluateCandidate(Long candidateId, CandidateEvaluationRequest request) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new AppException(ErrorCode.CANDIDATE_NOT_FOUND));
        if(candidate.getStatus()!= CandidateStatus.INTERVIEWED){
            throw new AppException(ErrorCode.CANDIDATE_CANNOT_BE_UPDATED);
        }
        candidate.setRatingTechnical(request.getRatingTechnical());
        candidate.setRatingCommunication(request.getRatingCommunication());
        candidate.setRatingProblemSolving(request.getRatingProblemSolving());
        candidate.setRatingExperience(request.getRatingExperience());
        candidate.setRatingCultureFit(request.getRatingCultureFit());
        candidate.setFeedback(request.getFeedback());

        BigDecimal avg = BigDecimal.valueOf(
                (request.getRatingTechnical()
                        + request.getRatingCommunication()
                        + request.getRatingProblemSolving()
                        + request.getRatingExperience()
                        + request.getRatingCultureFit()) / 5.0
        );

        candidate.setRatingAverage(avg);
        candidateRepository.save(candidate);
    }
    @Transactional
    public void markInterviewed(Long candidateId, boolean passed) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new AppException(ErrorCode.CANDIDATE_NOT_FOUND));

        if (passed) {
            candidate.transitionTo(CandidateStatus.PASSED);
        } else {
            candidate.transitionTo(CandidateStatus.FAILED);
        }

        candidateRepository.save(candidate);
    }
    public CandidateResponse updateCandidate(Long candidateId, CandidateUpdateRequest request) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new AppException(ErrorCode.CANDIDATE_NOT_FOUND));
        // chỉ update ứng viên chưa phỏng vấn
        if (candidate.getStatus() != CandidateStatus.NOT_INTERVIEWED) {
            throw new AppException(ErrorCode.CANDIDATE_CANNOT_BE_UPDATED);
        }
        Position position = positionRepository.findById(request.getPositionId()).orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));
        candidate.setPosition(position);
        candidate.setFullName(request.getFullName());
        candidate.setEmail(request.getEmail());
        candidate.setGender(request.getGender());
        candidate.setPhone(request.getPhone());
        candidate.setAddress(request.getAddress());
        candidate.setBirthDate(request.getBirthDate());
        candidate.setCv(request.getCv());
        Candidate updatedCandidate = candidateRepository.save(candidate);

        return candidateMapper.toCandidateResponse(updatedCandidate);
    }

    public List<CandidateResponse> filterCandidates(CandidateFilterRequest request, PageRequestDTO pageRequestDTO) {

        CandidateStatus status = null;
        if (request.getStatus() != null) {
            status = CandidateStatus.valueOf(request.getStatus());
        }

        return candidateRepository.filterCandidates(
                        request.getFullName(),
                        request.getEmail(),
                        request.getPositionId(),
                        status,
                        pageRequestDTO.buildPageable()
                )
                .stream()
                .map(candidateMapper::toCandidateResponse)
                .toList();
    }

}


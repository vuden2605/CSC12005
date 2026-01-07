package com.csc12005.hr.Service.CandidateService.impl;

import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.DTO.Response.CandidateResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.Entity.*;
import com.csc12005.hr.Enums.CandidateStatus;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.CandidateMapper;
import com.csc12005.hr.Mapper.EmployeeMapper;
import com.csc12005.hr.Repository.CandidateRepository;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.PositionRepository;
import com.csc12005.hr.Service.CandidateService.ICandidateService;
import com.csc12005.hr.Service.MailService.IMailService;
import com.csc12005.hr.Service.S3Service.Impl.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateService implements ICandidateService {
    private final CandidateRepository candidateRepository;
    private final CandidateMapper candidateMapper;
    private final PositionRepository positionRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeMapper employeeMapper;
    private final IMailService mailService;
    private final S3Service s3ervice;

    public CandidateResponse createCandidate(CandidateCreationRequest request){
        Candidate candidate= candidateMapper.toCandidate(request);
        Position position= positionRepository.findById(request.getPositionId()).orElseThrow(()-> new AppException(ErrorCode.POSITION_NOT_FOUND));
        candidate.setPosition(position);
        String cvUrl= request.getCv()!=null? s3ervice.uploadFile(request.getCv()): null;
        candidate.setCv(cvUrl);
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
        String cvUrl = request.getCv() != null ? s3ervice.uploadFile(request.getCv()) : candidate.getCv();
        candidate.setCv(cvUrl);
        Candidate updatedCandidate = candidateRepository.save(candidate);

        return candidateMapper.toCandidateResponse(updatedCandidate);
    }

    public Page<CandidateResponse> filterCandidates(CandidateFilterRequest request, PageRequestDTO pageRequestDTO) {

        CandidateStatus status = null;
        if (request.getStatus() != null) {
            status = CandidateStatus.valueOf(request.getStatus());
        }

        Page<Candidate> candidateResponses= candidateRepository.filterCandidates(
                        request.getFullName(),
                        request.getEmail(),
                        request.getPositionId(),
                        status,
                        pageRequestDTO.buildPageable()
                );

        return candidateResponses.map(candidateMapper::toCandidateResponse);
    }
    public CandidateResponse getCandidateById(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new AppException(ErrorCode.CANDIDATE_NOT_FOUND));
        return candidateMapper.toCandidateResponse(candidate); }
    private String generateEmployeeCode(Department department) {
        // Generate employee code logic
        int year = LocalDate.now().getYear();
        long count = employeeRepository.countByYearAndDepartmentAndPosition(year, department.getId());
        long sequence = count + 1;
        String sequenceFormatted = String.format("%03d", sequence);
        return year + "_" + department.getDepartmentCode() + "_" + sequenceFormatted;
    }
    @Transactional
    public EmployeeResponse hireCandidate(Long candidateId){
        Candidate candidate= candidateRepository.findById(candidateId).orElseThrow(()-> new AppException(ErrorCode.CANDIDATE_NOT_FOUND));
        if(candidate.getStatus()!= CandidateStatus.PASSED){
            throw new AppException(ErrorCode.CANDIDATE_CANNOT_BE_HIRED);   }
        var employeeCode= generateEmployeeCode(candidate.getPosition().getDepartment());
        Employee employee = Employee.builder()
                .fullName(candidate.getFullName())
                .email(candidate.getEmail())
                .employeeCode(employeeCode)
                .phone(candidate.getPhone())
                .gender(candidate.getGender())
                .address(candidate.getAddress())
                .password(passwordEncoder.encode(employeeCode))
                .birthDate(candidate.getBirthDate())
                .position(candidate.getPosition())
                .department(candidate.getPosition().getDepartment())
                .hireDate(LocalDate.now())
                .build();
        employeeRepository.save(employee);
        candidate.transitionTo(CandidateStatus.HIRED);
        candidateRepository.save(candidate);
        // Gửi email chúc mừng
        mailService.sendInterviewPassedMail(
                candidate.getEmail(),
                candidate.getFullName(),
                candidate.getPosition().getPositionName()
        );
        return employeeMapper.toEmployeeResponse(employee);
    }
}


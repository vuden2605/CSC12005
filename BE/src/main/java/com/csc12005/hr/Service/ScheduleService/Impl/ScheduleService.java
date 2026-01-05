package com.csc12005.hr.Service.ScheduleService.Impl;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.ScheduleCreationRequest;
import com.csc12005.hr.DTO.Request.ScheduleFilterRequest;
import com.csc12005.hr.DTO.Request.ScheduleUpdateRequest;
import com.csc12005.hr.DTO.Response.ScheduleResponse;
import com.csc12005.hr.Entity.*;
import com.csc12005.hr.Enums.CandidateStatus;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.ScheduleMapper;
import com.csc12005.hr.Repository.*;
import com.csc12005.hr.Service.MailService.IMailService;
import com.csc12005.hr.Service.ScheduleService.IScheduleService;
import com.csc12005.hr.Utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.Lint;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.stylesheets.LinkStyle;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService implements IScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final ScheduleMapper scheduleMapper;
    private final EmployeeRepository employeeRepository;
    private final CandidateRepository candidateRepository;
    private final PositionRepository positionRepository;
    private final DepartmentRepository departmentRepository;
    private final IMailService mailService;
    private final SecurityUtils securityUtils;

    public ScheduleResponse createSchedule(ScheduleCreationRequest scheduleCreationRequest)
    {
        // tạo lịch trước 5 ngày
        LocalDate startDate = scheduleCreationRequest.getDate();
        LocalDate fiveDaysAgo = startDate.minusDays(5);

        if (!LocalDate.now().isBefore(fiveDaysAgo)) {
            throw new AppException(ErrorCode.DATE_TOO_RECENT);
        }
        // lấy người phỏng vấn là trưởng phòng

        Schedule schedule= scheduleMapper.toSchedule(scheduleCreationRequest);
        Position position=positionRepository.findById(scheduleCreationRequest.getPositionId()).orElseThrow(()-> new AppException(ErrorCode.POSITION_NOT_FOUND));
        Department department= departmentRepository.findById(position.getDepartment().getId()).orElseThrow(()-> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
        Employee employee= employeeRepository.findById(department.getManager().getId()).orElseThrow(()-> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
        // kiểm tra người phỏng vấn có đang có lịch vào cùng khung giờ, ngày không
        List<Schedule> existingSchedules= scheduleRepository.findByInterviewerAndDateAndTimeSlot(
                employee,
                scheduleCreationRequest.getDate(),
                scheduleCreationRequest.getTimeSlot()
        );
        if(!existingSchedules.isEmpty()){
            throw new AppException(ErrorCode.INTERVIEWER_HAS_SCHEDULE_CONFLICT);
        }
        // lưu người phỏng vấn
        schedule.setInterviewer(employee);
        schedule.setPosition(position);
        return scheduleMapper.toScheduleResponse(scheduleRepository.save(schedule));
    }
    @Transactional
    public void addCandidatesToSchedule(
            Long scheduleId,
            List<Long> candidateIds
    ) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new AppException(ErrorCode.SCHEDULE_NOT_FOUND));
        // chỉ được thêm ứng viên vào lịch trước 2 ngày
        LocalDate startDate = schedule.getDate();
        LocalDate twoDaysAgo = startDate.minusDays(2);

        if (!LocalDate.now().isBefore(twoDaysAgo)) {
            throw new AppException(ErrorCode.UPDATE_SCHEDULE_TOO_LATE);
        }

        List<Candidate> candidates =
                candidateRepository.findAllById(candidateIds);

        if (candidates.size() != candidateIds.size()) {
            throw new AppException(ErrorCode.CANDIDATE_NOT_FOUND);
        }

        for (Candidate candidate : candidates) {

            // (1) Validate nghiệp vụ
            if (candidate.getSchedule() != null) {
                throw new AppException(ErrorCode.CANDIDATE_ALREADY_SCHEDULED);
            }

            // (2) Gán lịch
            candidate.setSchedule(schedule);
            // (3) Chuyển trạng thái ứng viên
            candidate.transitionTo(CandidateStatus.INTERVIEWING);
        }

        // (4) save all candidate
        candidateRepository.saveAll(candidates);
        // send mail
        for (Candidate candidate : candidates) {
            mailService.sendInterviewScheduleMail(
                    candidate.getEmail(),
                    candidate.getFullName(),
                    schedule
            );
        }
    }
    public ScheduleResponse updateSchedule(
            Long scheduleId,
            ScheduleUpdateRequest scheduleUpdateRequest
    ){
        Schedule existingSchedule= scheduleRepository.findById(scheduleId).orElseThrow(()-> new AppException(ErrorCode.SCHEDULE_NOT_FOUND));
        // chỉ được sửa lịch trước 2 ngày
        LocalDate startDate = existingSchedule.getDate();
        LocalDate twoDaysAgo = startDate.minusDays(2);

        if (!LocalDate.now().isBefore(twoDaysAgo)) {
            throw new AppException(ErrorCode.UPDATE_SCHEDULE_TOO_LATE);
        }
        // ngày mới phải lớn hơn hoặc bằng ngày của lịch cũ

        LocalDate newDate = scheduleUpdateRequest.getDate();
        if (newDate.isBefore(existingSchedule.getDate())) {
            throw new AppException(ErrorCode.DATE_IN_PAST);
        }

        existingSchedule.setTimeSlot(scheduleUpdateRequest.getTimeSlot());
        existingSchedule.setDate(scheduleUpdateRequest.getDate());
        existingSchedule.setLocation(scheduleUpdateRequest.getLocation());
        Schedule updatedSchedule= scheduleRepository.save(existingSchedule);
        return scheduleMapper.toScheduleResponse(updatedSchedule);
    }

    @Transactional
    public void removeCandidateFromSchedule(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new AppException(ErrorCode.CANDIDATE_NOT_FOUND));

        if (candidate.getSchedule() == null) {
            throw new AppException(ErrorCode.CANDIDATE_NOT_IN_SCHEDULE);
        }
        // chỉ được xóa ứng viên khỏi lịch trước 2 ngày
        LocalDate startDate = candidate.getSchedule().getDate();
        LocalDate twoDaysAgo = startDate.minusDays(2);

        if (!LocalDate.now().isBefore(twoDaysAgo)) {
            throw new AppException(ErrorCode.UPDATE_SCHEDULE_TOO_LATE);
        }

        candidate.setSchedule(null);
        candidate.transitionTo(CandidateStatus.NOT_INTERVIEWED);

        candidateRepository.save(candidate);
    }
    @Transactional
    public void cancelSchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new AppException(ErrorCode.SCHEDULE_NOT_FOUND));
        // chỉ được hủy lịch trước 2 ngày
        LocalDate startDate = schedule.getDate();
        LocalDate twoDaysAgo = startDate.minusDays(2);

        if (!LocalDate.now().isBefore(twoDaysAgo)) {
            throw new AppException(ErrorCode.UPDATE_SCHEDULE_TOO_LATE);
        }
        // không được hủy lịch đã hoàn thành
        if (schedule.getStatus() == com.csc12005.hr.Enums.ScheduleStatus.COMPLETED) {
            throw new AppException(ErrorCode.CANNOT_CANCEL_COMPLETED_SCHEDULE);
        }
        // cập nhật trạng thái ứng viên trong lịch về NOT_INTERVIEWED và xóa lịch của họ
        List<Candidate> candidates = schedule.getCandidates();

        for (Candidate candidate : candidates) {
            candidate.setSchedule(null);
            candidate.transitionTo(CandidateStatus.NOT_INTERVIEWED);
        }
        candidateRepository.saveAll(candidates);
        //cập nhật trạng thiái lịch thành CANCELLED
        schedule.setStatus(com.csc12005.hr.Enums.ScheduleStatus.CANCELLED);
        scheduleRepository.save(schedule);
    }
    public Page<ScheduleResponse> filterSchedules(
            ScheduleFilterRequest request,
            PageRequestDTO pageRequestDTO
    ) {


        Page<Schedule> page = scheduleRepository.filterSchedules(
                request.getPositionId(),
                request.getTimeSlot(),
                request.getStatus(),
                request.getLocation(),
                request.getDateFrom(),
                request.getDateTo(),
                pageRequestDTO.buildPageable()
        );

        return page.map(scheduleMapper::toScheduleResponse);
    }
    public ScheduleResponse getScheduleById(Long scheduleId){
        Schedule schedule= scheduleRepository.findById(scheduleId).orElseThrow(()-> new AppException(ErrorCode.SCHEDULE_NOT_FOUND));
        return scheduleMapper.toScheduleResponse(schedule);
    }
    public Page<ScheduleResponse> mySchedules(
            ScheduleFilterRequest request,
            PageRequestDTO pageRequestDTO
    ) {
        var myId = securityUtils.getCurrentUserId();
        Employee employee= employeeRepository.findById(myId).orElseThrow(()-> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        Page<Schedule> page = scheduleRepository.filterSchedules(
                employee.getPosition().getId(),
                request.getTimeSlot(),
                request.getStatus(),
                request.getLocation(),
                request.getDateFrom(),
                request.getDateTo(),
                pageRequestDTO.buildPageable()
        );

        return page.map(scheduleMapper::toScheduleResponse);
    }

}

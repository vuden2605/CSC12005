package com.csc12005.hr.Service.LeaveRequestService.impl;


import com.csc12005.hr.Entity.LeaveRequest;
import com.csc12005.hr.Repository.LeaveRequestRepository;
import com.csc12005.hr.DTO.Request.LeaveRequestCreationRequest;
import com.csc12005.hr.DTO.Response.LeaveRequestResponse;
import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Mapper.LeaveRequestMapper;
import lombok.RequiredArgsConstructor;
import com.csc12005.hr.Service.LeaveRequestService.ILeaveRequestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

// import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeaveRequestServiceImpl implements ILeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveRequestMapper mapper;

    @Override
    public LeaveRequestResponse approveLeaveRequest(Long id, LeaveRequestCreationRequest dto) {
        LeaveRequest req = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setStatus(dto.isApprove() ? RequestStatus.APPROVED : RequestStatus.REJECTED);
        req.setApprover(dto.getApprover());

        leaveRequestRepository.save(req);

        return mapper.toResponse(req);
    }
}

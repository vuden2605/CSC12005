package com.csc12005.hr.Service.Impl;

import com.csc12005.hr.DTO.Request.LeaveRequestCreationRequest;
import com.csc12005.hr.DTO.Response.LeaveResponse;
import com.csc12005.hr.Entity.LeaveRequest;
import com.csc12005.hr.Repository.LeaveRequestRepository;
import com.csc12005.hr.Service.ILeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@Transactional
public class LeaveRequestService implements ILeaveRequestService {
    private final LeaveRequestRepository requestRepository;
    @Autowired
    public LeaveRequestService(LeaveRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    @Override
    public CompletableFuture<LeaveResponse> createLeaveRequestAsync(Integer employeeId, LeaveRequestCreationRequest dto) {
        return CompletableFuture.supplyAsync(() -> {
            String attachmentUrl = null;
            LeaveRequest entity = new LeaveRequest();
            entity.setEmployeeId(employeeId);
            entity.setStartDate(dto.getStartDate());
            entity.setEndDate(dto.getEndDate());
            entity.setReason(dto.getReason());
            entity.setAttachmentUrl(attachmentUrl);
            entity.setStatus("Pending");
            entity.setCreateAt(LocalDateTime.now());

            LeaveRequest savedEntity = requestRepository.save(entity);

            LeaveResponse response = new LeaveResponse();
            response.setRequestId(savedEntity.getRequestId());
            response.setStatus(savedEntity.getStatus());
            response.setCreateAt(savedEntity.getCreateAt());


            return response;
        });
    }

    @Override
    public CompletableFuture<List<LeaveResponse>> getLeaveRequestsAsync(Integer employeeId, String filters) {
        // Triển khai logic lấy danh sách
        return CompletableFuture.supplyAsync(List::of);
    }
    
    @Override
    public CompletableFuture<Double> getLeaveBalanceAsync(Integer employeeId) {
        // Triển khai logic kiểm tra số dư phép
        return CompletableFuture.completedFuture(0.0);
    }
}
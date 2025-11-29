package com.csc12005.hr.Service.ViewLeaveRequestService.impl;


import com.csc12005.hr.DTO.Request.ViewLeaveRequestFilterRequest;
import com.csc12005.hr.DTO.Response.LeaveRequestListItemResponse;
import com.csc12005.hr.DTO.Response.LeaveRequestListResponse;
import com.csc12005.hr.Entity.LeaveRequest;
import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Exception.NotFoundException;
import com.csc12005.hr.Mapper.ViewLeaveRequestMapper;
import com.csc12005.hr.Repository.ILeaveRequestQueryRepository;
import com.csc12005.hr.Service.ViewLeaveRequestService.IViewLeaveRequestService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ViewLeaveRequestServiceimpl implements IViewLeaveRequestService {

    private final ILeaveRequestQueryRepository requestRepo;
    private final ViewLeaveRequestMapper mapper;

    @Override
    public LeaveRequestListResponse getLeaveRequests(Long employeeId, ViewLeaveRequestFilterRequest filters) {

        if (employeeId == null || employeeId <= 0) {
            throw new NotFoundException("Employee ID không hợp lệ");
        }

        Pageable pageable = PageRequest.of(filters.getPage() - 1, filters.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<LeaveRequest> page = requestRepo.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("employee").get("id"), employeeId));

            if (filters.getStatus() != null && !filters.getStatus().equalsIgnoreCase("all")) {
                RequestStatus statusEnum = RequestStatus.valueOf(filters.getStatus().toUpperCase());
                predicates.add(cb.equal(root.get("status"), statusEnum));
            }

            if (filters.getStartDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                        root.get("startDate"),
                        filters.getStartDate().atStartOfDay()
                ));
            }

            if (filters.getEndDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(
                        root.get("endDate"),
                        filters.getEndDate().atTime(23, 59, 59)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        }, pageable);

        if (page.isEmpty()) {
            throw new NotFoundException("Không tìm thấy yêu cầu nghỉ phép");
        }

        List<LeaveRequestListItemResponse> items = page.getContent().stream()
                .map(mapper::toListItem)
                .toList();

        LeaveRequestListResponse response = new LeaveRequestListResponse();
        response.setRequests(items);
        response.setPage(filters.getPage());
        response.setPageSize(filters.getPageSize());
        response.setTotalItems(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());

        return response;
    }
}

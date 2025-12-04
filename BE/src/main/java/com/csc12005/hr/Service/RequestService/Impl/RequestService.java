package com.csc12005.hr.Service.RequestService.Impl;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.RequestFilter;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Mapper.RequestMapper;
import com.csc12005.hr.Repository.RequestRepository;
import com.csc12005.hr.Service.RequestService.IRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RequestService implements IRequestService {
	private final RequestRepository requestRepository;
	private final RequestMapper requestMapper;
	@Override
	public Page<RequestResponse> getRequestByManager(PageRequestDTO pageRequestDTO, RequestFilter requestFilter) {
		Pageable pageable = pageRequestDTO.buildPageable();
		var context = SecurityContextHolder.getContext();
		long employeeId = Long.parseLong(context.getAuthentication().getName());
		Page<Request> requests = requestRepository.getRequestByManager(
					pageable,
					requestFilter.getStatus(),
					requestFilter.getRequestType(),
					requestFilter.getStartDate(),
					requestFilter.getEndDate(),
					employeeId
		);
		return requests.map(requestMapper::toRequestResponse);
	}

	@Override
	public Page<RequestResponse> myRequests(PageRequestDTO pageRequestDTO, RequestFilter requestFilter) {
		Pageable pageable = pageRequestDTO.buildPageable();
		var context = SecurityContextHolder.getContext();
		long employeeId = Long.parseLong(context.getAuthentication().getName());
		Page<Request> requests = requestRepository.myRequests(
				pageable,
				requestFilter.getStatus(),
				requestFilter.getRequestType(),
				requestFilter.getStartDate(),
				requestFilter.getEndDate(),
				employeeId
		);
		return requests.map(requestMapper::toRequestResponse);
	}
}

package com.csc12005.hr.Service.RequestService.Impl;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Request.RequestFilter;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Enums.RequestType;
import com.csc12005.hr.Mapper.RequestMapper;
import com.csc12005.hr.Repository.RequestRepository;
import com.csc12005.hr.Service.RequestService.IRequestService;
import com.csc12005.hr.Service.RequestService.Provider.IRequestProvider;
import com.csc12005.hr.Service.RequestService.Provider.RequestProviderFactory;
import com.csc12005.hr.Utils.SecurityUtils;
import jakarta.transaction.Transactional;
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
	private final RequestProviderFactory requestProviderFactory;
	private final SecurityUtils securityUtils;

	@Override
	@Transactional
	public RequestResponse createRequest(RequestCreationRequest request, RequestType requestType) {
		IRequestProvider provider = requestProviderFactory.getProvider(requestType);
		return provider.createRequest(request);
	}

	@Transactional
	public RequestResponse approveRequest(Long requestId, RequestType requestType) {
		IRequestProvider provider = requestProviderFactory.getProvider(requestType);
		return provider.approveRequest(requestId);
	}

	@Transactional
	public RequestResponse rejectRequest(Long requestId, RequestType requestType) {

		IRequestProvider provider = requestProviderFactory.getProvider(requestType);
		return provider.rejectRequest(requestId);
	}

	@Override
	public RequestResponse getRequestById(Long requestId, RequestType requestType) {
		IRequestProvider provider = requestProviderFactory.getProvider(requestType);
		return provider.getRequestById(requestId);
	}

	@Override
	public Page<RequestResponse> getRequestByManager(PageRequestDTO pageRequestDTO, RequestFilter requestFilter) {
		Pageable pageable = pageRequestDTO.buildPageable();
		Long employeeId = securityUtils.getCurrentUserId();
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
		Long employeeId = securityUtils.getCurrentUserId();
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

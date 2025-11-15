package com.csc12005.hr.Service.RequestService.Impl;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Mapper.RequestMapper;
import com.csc12005.hr.Repository.RequestRepository;
import com.csc12005.hr.Service.RequestService.IRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RequestService implements IRequestService {
	private final RequestRepository requestRepository;
	private final RequestMapper requestMapper;
	public RequestResponse getRequestById(Long id) {
		Request request = requestRepository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
		return requestMapper.toRequestResponse(request);
	}
	public RequestResponse createRequest(RequestCreationRequest requestCreationRequest) {
		Request request= requestMapper.toRequest(requestCreationRequest);
		Request savedRequest = requestRepository.save(request);
		return requestMapper.toRequestResponse(savedRequest);
	}
}

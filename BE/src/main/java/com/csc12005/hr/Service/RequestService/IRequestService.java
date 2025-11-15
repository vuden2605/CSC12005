package com.csc12005.hr.Service.RequestService;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import org.springframework.stereotype.Service;

@Service
public interface IRequestService {
	RequestResponse getRequestById(Long id);
	RequestResponse createRequest(RequestCreationRequest requestCreationRequest);
}

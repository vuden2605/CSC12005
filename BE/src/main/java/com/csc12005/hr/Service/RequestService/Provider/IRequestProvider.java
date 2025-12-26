package com.csc12005.hr.Service.RequestService.Provider;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Enums.RequestType;

public interface IRequestProvider {
	RequestType getRequestType();
	RequestResponse createRequest(RequestCreationRequest request);
	RequestResponse approveRequest(Long requestId);
	RequestResponse rejectRequest(Long requestId);
	RequestResponse getRequestById(Long requestId);
}

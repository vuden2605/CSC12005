package com.csc12005.hr.Service.RequestService;

import com.csc12005.hr.DTO.Request.ProcessManyRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Request.RequestFilter;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Enums.RequestType;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface IRequestService {
	RequestResponse createRequest (RequestCreationRequest request, RequestType requestType);
	RequestResponse approveRequest (Long requestId, RequestType requestType);
	Page<RequestResponse> getRequestByManager (PageRequestDTO pageRequestDTO, RequestFilter requestFilter);
	Page<RequestResponse> myRequests (PageRequestDTO pageRequestDTO, RequestFilter requestFilter);
	RequestResponse rejectRequest (Long requestId, RequestType requestType);
	RequestResponse getRequestById (Long requestId, RequestType requestType);
	void approveManyRequests (ProcessManyRequest request);
	void rejectManyRequests (ProcessManyRequest request);
}

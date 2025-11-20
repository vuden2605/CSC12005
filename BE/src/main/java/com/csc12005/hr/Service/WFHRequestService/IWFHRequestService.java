package com.csc12005.hr.Service.WFHRequestService;

import com.csc12005.hr.DTO.Request.WFHCreationRequest;
import com.csc12005.hr.DTO.Response.WFHResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IWFHRequestService {
	WFHResponse createWFHRequest(WFHCreationRequest wfhCreationRequest);
	List<WFHResponse> getAllWFHRequests();
	WFHResponse approveWFHRequest(Long requestId);
	WFHResponse rejectWFHRequest(Long requestId);
}

package com.csc12005.hr.Service.WFHRequestService;

import com.csc12005.hr.DTO.Request.WFHCreationRequest;
import com.csc12005.hr.DTO.Response.WFHResponse;
import org.springframework.stereotype.Service;

@Service
public interface IWFHRequestService {
	WFHResponse createWFHRequest(WFHCreationRequest wfhCreationRequest);
}

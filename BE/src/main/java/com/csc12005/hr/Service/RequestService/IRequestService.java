package com.csc12005.hr.Service.RequestService;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.RequestFilter;
import com.csc12005.hr.DTO.Response.RequestResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface IRequestService {
	Page<RequestResponse> getRequest (PageRequestDTO pageRequestDTO, RequestFilter requestFilter);
}

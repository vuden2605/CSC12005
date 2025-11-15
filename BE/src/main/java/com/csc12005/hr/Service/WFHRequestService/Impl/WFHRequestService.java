package com.csc12005.hr.Service.WFHRequestService.Impl;

import com.csc12005.hr.DTO.Request.WFHCreationRequest;
import com.csc12005.hr.DTO.Response.WFHResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.WFHRequest;
import com.csc12005.hr.Enums.RequestType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.WFHRequestMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.WFhRequestRepository;
import com.csc12005.hr.Service.WFHRequestService.IWFHRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WFHRequestService implements IWFHRequestService {
	private final WFHRequestMapper wfhRequestMapper;
	private final WFhRequestRepository wFhRequestRepository;
	private final EmployeeRepository employeeRepository;
	@Override
	public WFHResponse createWFHRequest(WFHCreationRequest wfhCreationRequest) {
		WFHRequest wfhRequest = wfhRequestMapper.toWFHRequest(wfhCreationRequest);
		wfhRequest.setRequestType(RequestType.WorkFromHome);
		var context = SecurityContextHolder.getContext();
		long employeeId = Long.parseLong(context.getAuthentication().getName());
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		wfhRequest.setEmployee(employee);
		WFHRequest savedWFHRequest = wFhRequestRepository.save(wfhRequest);
		return wfhRequestMapper.toWFHResponse(savedWFHRequest);
	}
}

package com.csc12005.hr.Service.TimeSheetRequestService.Impl;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.TimeSheetRequestResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Entity.TimeSheetRequest;
import com.csc12005.hr.Enums.RequestType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.RequestMapper;
import com.csc12005.hr.Mapper.TimeSheetRequestMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.RequestRepository;
import com.csc12005.hr.Repository.TimeSheetRequestRepository;
import com.csc12005.hr.Service.TimeSheetRequestService.ITimeSheetRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TimeSheetRequestService implements ITimeSheetRequestService {
	private final RequestRepository requestRepository;
	private final TimeSheetRequestRepository timeSheetRequestRepository;
	private final TimeSheetRequestMapper timeSheetRequestMapper;
	private final RequestMapper requestMapper;
	private final EmployeeRepository employeeRepository;
	@Transactional
	public TimeSheetRequestResponse createTimesheetRequest(TimeSheetRequestCreationRequest timeSheetRequestCreationRequest) {
		TimeSheetRequest timeSheetRequest= timeSheetRequestMapper.toTimeSheetRequest(timeSheetRequestCreationRequest);
		timeSheetRequest.setRequestType(RequestType.TimeSheet);
		var context = SecurityContextHolder.getContext();
		long employeeId = Long.parseLong(context.getAuthentication().getName());
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		timeSheetRequest.setEmployee(employee);
		return timeSheetRequestMapper.toTimeSheetRequestResponse(timeSheetRequestRepository.save(timeSheetRequest));
	}
}

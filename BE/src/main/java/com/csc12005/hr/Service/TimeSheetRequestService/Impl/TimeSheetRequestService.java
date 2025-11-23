package com.csc12005.hr.Service.TimeSheetRequestService.Impl;

import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.TimeSheetRequestResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Entity.TimeSheetRequest;
import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Enums.RequestType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.TimeSheetRequestMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.TimeSheetRepository;
import com.csc12005.hr.Repository.TimeSheetRequestRepository;
import com.csc12005.hr.Service.TimeSheetRequestService.ITimeSheetRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TimeSheetRequestService implements ITimeSheetRequestService {
	private final TimeSheetRequestRepository timeSheetRequestRepository;
	private final TimeSheetRequestMapper timeSheetRequestMapper;
	private final EmployeeRepository employeeRepository;
	private final TimeSheetRepository timeSheetRepository;
	@Transactional
	public TimeSheetRequestResponse createTimeSheetRequest(TimeSheetRequestCreationRequest timeSheetRequestCreationRequest) {
		var context = SecurityContextHolder.getContext();
		long employeeId = Long.parseLong(context.getAuthentication().getName());
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		TimeSheet timeSheet = timeSheetRepository.findByEmployeeEmployeeIdAndWorkDate(employeeId, timeSheetRequestCreationRequest.getWorkDate())
				.orElseThrow(() -> new AppException(ErrorCode.TIMESHEET_NOT_FOUND));
		TimeSheetRequest timeSheetRequest= timeSheetRequestMapper.toTimeSheetRequest(timeSheetRequestCreationRequest);
		timeSheetRequest.setRequestType(RequestType.TimeSheet);
		timeSheetRequest.setEmployee(employee);
		return timeSheetRequestMapper.toTimeSheetRequestResponse(timeSheetRequestRepository.save(timeSheetRequest));
	}
	@Transactional
	public TimeSheetRequestResponse approvedTimeSheetRequest (Long id) {
		TimeSheetRequest timeSheetRequest = timeSheetRequestRepository.findById(id)
				.orElseThrow(() -> new AppException(ErrorCode.TIMESHEET_REQUEST_NOT_FOUND));
		timeSheetRequest.setStatus(RequestStatus.APPROVED);
		var context = SecurityContextHolder.getContext();
		long managerId = Long.parseLong(context.getAuthentication().getName());
		Employee employee = timeSheetRequest.getEmployee();
		if(managerId == employee.getEmployeeId()) {
			TimeSheet timeSheet = timeSheetRepository.findByEmployeeEmployeeIdAndWorkDate(employee.getEmployeeId(), timeSheetRequest.getWorkDate())
					.orElseThrow(() -> new AppException(ErrorCode.TIMESHEET_NOT_FOUND));
			timeSheet.setCheckIn(timeSheetRequest.getCheckInNew());
			timeSheet.setCheckOut(timeSheetRequest.getCheckOutNew());
			timeSheetRepository.save(timeSheet);
		}
		return timeSheetRequestMapper.toTimeSheetRequestResponse(timeSheetRequestRepository.save(timeSheetRequest));
	}
	public TimeSheetRequestResponse rejectedTimeSheetRequest (Long id) {
		TimeSheetRequest timeSheetRequest = timeSheetRequestRepository.findById(id)
				.orElseThrow(() -> new AppException(ErrorCode.TIMESHEET_REQUEST_NOT_FOUND));
		timeSheetRequest.setStatus(RequestStatus.REJECTED);
		return timeSheetRequestMapper.toTimeSheetRequestResponse(timeSheetRequestRepository.save(timeSheetRequest));
	}
}

package com.csc12005.hr.Service.TimeSheetRequestService.Impl;

import com.csc12005.hr.DTO.Request.TimeSheetRequestCreated;
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
import com.csc12005.hr.Service.S3Service.Impl.S3Service;
import com.csc12005.hr.Service.TimeSheetRequestService.ITimeSheetRequestService;
import com.csc12005.hr.Utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
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
	private final S3Service s3Service;
	private final ApplicationEventPublisher applicationEventPublisher;
	private final SecurityUtils securityUtils;
	@Transactional
	public TimeSheetRequestResponse createTimeSheetRequest(TimeSheetRequestCreationRequest timeSheetRequestCreationRequest) {
		Long employeeId = securityUtils.getCurrentUserId();
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		TimeSheet timeSheet = timeSheetRepository.findByEmployeeIdAndWorkDate(employeeId, timeSheetRequestCreationRequest.getWorkDate())
				.orElseThrow(() -> new AppException(ErrorCode.TIMESHEET_NOT_FOUND));
		String requestAttachmentUrl = s3Service.uploadFile(timeSheetRequestCreationRequest.getFile());
		TimeSheetRequest timeSheetRequest= timeSheetRequestMapper.toTimeSheetRequest(timeSheetRequestCreationRequest);
		timeSheetRequest.setRequestAttachment(requestAttachmentUrl);
		timeSheetRequest.setRequestType(RequestType.TimeSheet);
		timeSheetRequest.setEmployee(employee);
		TimeSheetRequest saved = timeSheetRequestRepository.save(timeSheetRequest);
		applicationEventPublisher.publishEvent(TimeSheetRequestCreated.builder()
				.requestId(timeSheetRequest.getId())
				.managerId(employee.getManager().getId())
				.employeeName(employee.getFullName())
				.build());
		return timeSheetRequestMapper.toTimeSheetRequestResponse(saved);
	}
	@Transactional
	public TimeSheetRequestResponse approvedTimeSheetRequest (Long id) {
		TimeSheetRequest timeSheetRequest = timeSheetRequestRepository.findByIdWithEmployee(id)
				.orElseThrow(() -> new AppException(ErrorCode.TIMESHEET_REQUEST_NOT_FOUND));
		timeSheetRequest.setStatus(RequestStatus.APPROVED);

		TimeSheet timeSheet = timeSheetRepository.findByEmployeeIdAndWorkDate(
				timeSheetRequest.getEmployee().getId(),
				timeSheetRequest.getWorkDate())
				.orElseThrow(() -> new AppException(ErrorCode.TIMESHEET_NOT_FOUND));
		timeSheet.setCheckIn(timeSheetRequest.getCheckInNew());
		timeSheet.setCheckOut(timeSheetRequest.getCheckOutNew());
		timeSheetRepository.save(timeSheet);
		return timeSheetRequestMapper.toTimeSheetRequestResponse(timeSheetRequestRepository.save(timeSheetRequest));
	}
	@Override
	public TimeSheetRequestResponse rejectedTimeSheetRequest (Long id) {
		TimeSheetRequest timeSheetRequest = timeSheetRequestRepository.findById(id)
				.orElseThrow(() -> new AppException(ErrorCode.TIMESHEET_REQUEST_NOT_FOUND));
		timeSheetRequest.setStatus(RequestStatus.REJECTED);
		return timeSheetRequestMapper.toTimeSheetRequestResponse(timeSheetRequestRepository.save(timeSheetRequest));
	}
	@Override
	public TimeSheetRequestResponse getTimeSheetRequestById (Long id) {
		TimeSheetRequest timeSheetRequest = timeSheetRequestRepository.findById(id)
				.orElseThrow(() -> new AppException(ErrorCode.TIMESHEET_REQUEST_NOT_FOUND));
		return timeSheetRequestMapper.toTimeSheetRequestResponse(timeSheetRequest);
	}
}

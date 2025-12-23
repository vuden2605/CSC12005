package com.csc12005.hr.Service.LeaveRequestService.Impl;

import com.csc12005.hr.DTO.Request.LeaveRequestCreationRequest;
import com.csc12005.hr.DTO.Request.LeaveRequestCreated;
import com.csc12005.hr.DTO.Response.LeaveRequestResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.LeaveRequest;
import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Enums.RequestType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.LeaveRequestMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.LeaveRequestRepository;
import com.csc12005.hr.Service.LeaveRequestService.ILeaveRequestService;
import com.csc12005.hr.Service.S3Service.Impl.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LeaveRequestService implements ILeaveRequestService {
	private final LeaveRequestRepository leaveRequestRepository;
	private final LeaveRequestMapper leaveRequestMapper;
	private final EmployeeRepository employeeRepository;
	private final S3Service s3Service;
	private final ApplicationEventPublisher eventPublisher;
	@Transactional
	@Override
	public LeaveRequestResponse createLeaveRequest(LeaveRequestCreationRequest request) {
		String attachmentUrl = s3Service.uploadFile(request.getFile());
		LeaveRequest leaveRequest = leaveRequestMapper.toLeaveRequest(request);
		leaveRequest.setRequestAttachment(attachmentUrl);
		var context = SecurityContextHolder.getContext();
		Long employeeId = Long.parseLong(context.getAuthentication().getName());
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		leaveRequest.setEmployee(employee);
		leaveRequest.setRequestType(RequestType.Leave);
		LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);
		eventPublisher.publishEvent(LeaveRequestCreated.builder()
				.requestId(savedRequest.getId())
				.employeeName(employee.getFullName())
				.managerId(employee.getManager().getId())
				.build());
		return leaveRequestMapper.toLeaveRequestResponse(savedRequest);
	}
	public LeaveRequestResponse approvedLeaveRequest(Long id) {
		LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
				.orElseThrow(() -> new AppException(ErrorCode.LEAVE_REQUEST_NOT_FOUND));
		leaveRequest.setStatus(RequestStatus.APPROVED);
		return leaveRequestMapper.toLeaveRequestResponse(leaveRequestRepository.save(leaveRequest));
	}
	public LeaveRequestResponse rejectedLeaveRequest(Long id) {
		LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
				.orElseThrow(() -> new AppException(ErrorCode.LEAVE_REQUEST_NOT_FOUND));
		leaveRequest.setStatus(RequestStatus.REJECTED);
		return leaveRequestMapper.toLeaveRequestResponse(leaveRequestRepository.save(leaveRequest));
	}
	@Override
	public LeaveRequestResponse getLeaveRequestById(Long id) {
		LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
				.orElseThrow(() -> new AppException(ErrorCode.LEAVE_REQUEST_NOT_FOUND));
		return leaveRequestMapper.toLeaveRequestResponse(leaveRequest);
	}
}

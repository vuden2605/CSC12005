package com.csc12005.hr.Service.RequestService.Provider;

import com.csc12005.hr.DTO.Request.LeaveRequestCreated;
import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.LeaveRequest;
import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Enums.RequestType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.LeaveRequestMapper;
import com.csc12005.hr.Mapper.RequestMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.LeaveRequestRepository;
import com.csc12005.hr.Repository.RequestRepository;
import com.csc12005.hr.Service.S3Service.Impl.S3Service;
import com.csc12005.hr.Utils.SecurityUtils;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
public class LeaveRequestProvider extends AbstractRequestProvider{
	private final LeaveRequestRepository leaveRequestRepository;
	private final LeaveRequestMapper leaveRequestMapper;
	public LeaveRequestProvider(
				SecurityUtils securityUtils,
				EmployeeRepository employeeRepository,
				S3Service s3Service,
				RequestMapper requestMapper,
				RequestRepository requestRepository,
				ApplicationEventPublisher eventPublisher,
				LeaveRequestRepository leaveRequestRepository,
				LeaveRequestMapper leaveRequestMapper
				) {
		super(securityUtils, employeeRepository, s3Service, requestMapper, requestRepository, eventPublisher);
		this.leaveRequestRepository = leaveRequestRepository;
		this.leaveRequestMapper = leaveRequestMapper;

	}
	@Override
	public RequestType getRequestType() {
		return RequestType.Leave;
	}

	@Transactional
	@Override
	protected RequestResponse doCreateRequest(
			RequestCreationRequest request,
			Employee employee,
			String attachmentUrl
	) {
		validateDateRange(request.getStartDate(), request.getEndDate());
		LeaveRequest leaveRequest = leaveRequestMapper.toLeaveRequest(request);
		setCommonFields(leaveRequest, employee, attachmentUrl, RequestType.Leave);
		LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
		eventPublisher.publishEvent(
				LeaveRequestCreated.builder()
						.requestId(saved.getId())
						.employeeName(employee.getFullName())
						.managerId(employee.getManager().getId())
						.build()
		);
		return leaveRequestMapper.toLeaveRequestResponse(saved);
	}

	@Override
	public RequestResponse approveRequest(Long requestId) {
		LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
				.orElseThrow(() -> new AppException(ErrorCode.LEAVE_REQUEST_NOT_FOUND));
		leaveRequest.setStatus(RequestStatus.APPROVED);
		return leaveRequestMapper.toLeaveRequestResponse(leaveRequestRepository.save(leaveRequest));
	}

	@Override
	public RequestResponse getRequestById(Long requestId) {
		return leaveRequestMapper.toLeaveRequestResponse(
				leaveRequestRepository.findById(requestId)
						.orElseThrow(() -> new AppException(ErrorCode.LEAVE_REQUEST_NOT_FOUND))
		);
	}
}

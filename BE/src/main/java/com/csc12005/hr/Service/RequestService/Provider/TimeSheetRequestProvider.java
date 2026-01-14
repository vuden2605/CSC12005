package com.csc12005.hr.Service.RequestService.Provider;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Request.TimeSheetRequestCreated;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Entity.TimeSheetRequest;
import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Enums.RequestType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.RequestMapper;
import com.csc12005.hr.Mapper.TimeSheetRequestMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.RequestRepository;
import com.csc12005.hr.Repository.TimeSheetRepository;
import com.csc12005.hr.Repository.TimeSheetRequestRepository;
import com.csc12005.hr.Service.S3Service.Impl.S3Service;
import com.csc12005.hr.Utils.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
@Slf4j
public class TimeSheetRequestProvider extends AbstractRequestProvider {
	private final TimeSheetRepository timeSheetRepository;
	private final TimeSheetRequestMapper timeSheetRequestMapper;
	private final TimeSheetRequestRepository timeSheetRequestRepository;

	public TimeSheetRequestProvider(
			SecurityUtils securityUtils,
			EmployeeRepository employeeRepository,
			S3Service s3Service,
			RequestMapper requestMapper,
			RequestRepository requestRepository,
			ApplicationEventPublisher eventPublisher,
			TimeSheetRepository timeSheetRepository,
			TimeSheetRequestMapper timeSheetRequestMapper,
			TimeSheetRequestRepository timeSheetRequestRepository
	) {
		super(securityUtils, employeeRepository, s3Service, requestMapper, requestRepository, eventPublisher);
		this.timeSheetRepository = timeSheetRepository;
		this.timeSheetRequestMapper = timeSheetRequestMapper;
		this.timeSheetRequestRepository = timeSheetRequestRepository;
	}

	@Override
	public RequestType getRequestType() {
		return RequestType.TimeSheet;
	}

	@Override
	public RequestResponse approveRequest(Long requestId) {
		TimeSheetRequest timeSheetRequest = timeSheetRequestRepository.findByIdWithEmployee(requestId)
				.orElseThrow(() -> new AppException(ErrorCode.TIMESHEET_REQUEST_NOT_FOUND));
		timeSheetRequest.setStatus(RequestStatus.APPROVED);

		TimeSheet timeSheet = timeSheetRepository.findByEmployeeIdAndWorkDate(
						timeSheetRequest.getEmployee().getId(),
						timeSheetRequest.getWorkDate())
				.orElseThrow(() -> new AppException(ErrorCode.TIMESHEET_NOT_FOUND));
		LocalTime checkInNew = timeSheetRequest.getCheckInNew();
		LocalTime checkOutNew = timeSheetRequest.getCheckOutNew();
		timeSheet.setCheckIn(checkInNew);
		timeSheet.setCheckOut(checkOutNew);
		timeSheet.calculateAll();
		timeSheet.setRequest(timeSheetRequest);
		timeSheetRepository.save(timeSheet);
		publishEventAfterApproval(timeSheetRequest);
		return timeSheetRequestMapper.toTimeSheetRequestResponse(timeSheetRequestRepository.save(timeSheetRequest));
	}

	@Override
	public RequestResponse doCreateRequest(
			RequestCreationRequest request,
			Employee employee,
			String attachmentUrl
	) {
		//validateWorkDate(request.getWorkDate());
		Long employeeId = employee.getId();
		TimeSheet timeSheet = timeSheetRepository.findByEmployeeIdAndWorkDate(employeeId, request.getWorkDate())
				.orElseThrow(() -> new AppException(ErrorCode.TIMESHEET_NOT_FOUND));
		log.info("Found timesheet: {}", timeSheet.getId());
		TimeSheetRequest timeSheetRequest= timeSheetRequestMapper.toTimeSheetRequest(request);
		setCommonFields(timeSheetRequest, employee, attachmentUrl, RequestType.TimeSheet);
		TimeSheetRequest saved = timeSheetRequestRepository.save(timeSheetRequest);
		RequestResponse requestResponse = timeSheetRequestMapper.toTimeSheetRequestResponse(saved);
		eventPublisher.publishEvent(TimeSheetRequestCreated.builder()
				.requestId(timeSheetRequest.getId())
				.managerId(employee.getManager() != null
						? employee.getManager().getId()
						: null)
				.employeeName(employee.getFullName())
				.build());
		return requestResponse;
	}
	@Override
	public RequestResponse getRequestById(Long requestId) {
		return timeSheetRequestMapper.toTimeSheetRequestResponse(
				timeSheetRequestRepository.findById(requestId)
						.orElseThrow(() -> new AppException(ErrorCode.TIMESHEET_REQUEST_NOT_FOUND))
		);
	}

}

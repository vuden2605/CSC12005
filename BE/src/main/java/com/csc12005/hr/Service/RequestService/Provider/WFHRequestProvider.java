package com.csc12005.hr.Service.RequestService.Provider;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Request.WFHRequestCreated;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Entity.WFHRequest;
import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Enums.RequestType;
import com.csc12005.hr.Enums.TimeSheetType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.RequestMapper;
import com.csc12005.hr.Mapper.WFHRequestMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.RequestRepository;
import com.csc12005.hr.Repository.TimeSheetRepository;
import com.csc12005.hr.Repository.WFHRequestRepository;
import com.csc12005.hr.Service.S3Service.Impl.S3Service;
import com.csc12005.hr.Utils.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class WFHRequestProvider extends AbstractRequestProvider{
	private final WFHRequestMapper wfhRequestMapper;
	private final WFHRequestRepository wFhRequestRepository;
	private final TimeSheetRepository timeSheetRepository;

	public WFHRequestProvider(
			SecurityUtils securityUtils,
			EmployeeRepository employeeRepository,
			S3Service s3Service,
			RequestMapper requestMapper,
			RequestRepository requestRepository,
			ApplicationEventPublisher eventPublisher,
			WFHRequestMapper wfhRequestMapper,
			WFHRequestRepository wFhRequestRepository,
			TimeSheetRepository timeSheetRepository) {
		super(securityUtils, employeeRepository, s3Service, requestMapper, requestRepository, eventPublisher);
		this.wfhRequestMapper = wfhRequestMapper;
		this.wFhRequestRepository = wFhRequestRepository;
		this.timeSheetRepository = timeSheetRepository;
	}

	@Override
	public RequestType getRequestType() {
		return RequestType.WorkFromHome;
	}

	@Override
	public RequestResponse approveRequest(Long requestId) {
		Long currentUserId = securityUtils.getCurrentUserId();
		WFHRequest wfhRequest = wFhRequestRepository.findById(requestId)
				.orElseThrow(() -> new AppException(ErrorCode.WFH_REQUEST_NOT_FOUND));
		Employee employee = wfhRequest.getEmployee();
		LocalDate startDate = wfhRequest.getStartDate();
		LocalDate endDate = wfhRequest.getEndDate();
		int days = (int) (endDate.toEpochDay() - startDate.toEpochDay()) + 1;
		List<TimeSheet> timeSheets = new ArrayList<>();
		for (int i = 0; i < days; i++) {
			TimeSheet timeSheet = TimeSheet.builder()
					.employee(employee)
					.workDate(startDate.plusDays(i))
					.checkIn(LocalTime.parse("08:00:00"))
					.checkOut(LocalTime.parse("17:00:00"))
					.workHours(BigDecimal.valueOf(8))
					.lateMinutes(0)
					.lateDeductionRate(BigDecimal.ZERO)
					.isAdjusted(true)
					.adjustmentReason("Work From Home")
					.type(TimeSheetType.WFH)
					.request(wfhRequest)
					.createdBy(employeeRepository.getReferenceById(currentUserId))
					.updatedBy(employeeRepository.getReferenceById(currentUserId))
					.build();
			timeSheets.add(timeSheet);
		}
		wfhRequest.setStatus(RequestStatus.APPROVED);
		WFHRequest savedRequest = wFhRequestRepository.save(wfhRequest);
		timeSheetRepository.saveAll(timeSheets);
		publishEventAfterApproval(wfhRequest);
		return wfhRequestMapper.toWFHResponse(savedRequest);
	}

	@Override
	public RequestResponse getRequestById(Long requestId) {
		return wfhRequestMapper.toWFHResponse(
				wFhRequestRepository.findById(requestId)
						.orElseThrow(() -> new AppException(ErrorCode.WFH_REQUEST_NOT_FOUND))
		);
	}
	@Override
	public RequestResponse doCreateRequest(RequestCreationRequest request, Employee employee, String attachmentUrl) {
		validateDateRange(request.getStartDate(), request.getEndDate());
		WFHRequest wfhRequest = wfhRequestMapper.toWFHRequest(request);
		setCommonFields(wfhRequest, employee, attachmentUrl, RequestType.WorkFromHome);
		WFHRequest savedWFHRequest = wFhRequestRepository.save(wfhRequest);
		eventPublisher.publishEvent(WFHRequestCreated.builder()
				.requestId(savedWFHRequest.getId())
				.managerId(employee.getManager().getId())
				.employeeName(employee.getFullName())
				.build());
		log.info("published WFHRequestCreated event for request id: {}", savedWFHRequest.getId());
		return wfhRequestMapper.toWFHResponse(savedWFHRequest);
	}
}

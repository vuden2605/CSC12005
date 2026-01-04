package com.csc12005.hr.Service.RequestService.Provider;

import com.csc12005.hr.DTO.Request.LeaveRequestCreated;
import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.LeaveRequest;
import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Enums.LeaveType;
import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Enums.RequestType;
import com.csc12005.hr.Enums.TimeSheetType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.LeaveRequestMapper;
import com.csc12005.hr.Mapper.RequestMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.LeaveRequestRepository;
import com.csc12005.hr.Repository.RequestRepository;
import com.csc12005.hr.Repository.TimeSheetRepository;
import com.csc12005.hr.Service.S3Service.Impl.S3Service;
import com.csc12005.hr.Utils.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class LeaveRequestProvider extends AbstractRequestProvider{
	private final LeaveRequestRepository leaveRequestRepository;
	private final LeaveRequestMapper leaveRequestMapper;
	private final TimeSheetRepository timeSheetRepository;
	public LeaveRequestProvider(
				SecurityUtils securityUtils,
				EmployeeRepository employeeRepository,
				S3Service s3Service,
				RequestMapper requestMapper,
				RequestRepository requestRepository,
				ApplicationEventPublisher eventPublisher,
				LeaveRequestRepository leaveRequestRepository,
				LeaveRequestMapper leaveRequestMapper,
				TimeSheetRepository timeSheetRepository
				) {
		super(securityUtils, employeeRepository, s3Service, requestMapper, requestRepository, eventPublisher);
		this.leaveRequestRepository = leaveRequestRepository;
		this.leaveRequestMapper = leaveRequestMapper;
		this.timeSheetRepository = timeSheetRepository;

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
		leaveRequest.setLeaveType(request.getLeaveType());
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
	@Transactional
	@Override
	public RequestResponse approveRequest(Long requestId) {
		LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
				.orElseThrow(() -> new AppException(ErrorCode.LEAVE_REQUEST_NOT_FOUND));
		leaveRequest.setStatus(RequestStatus.APPROVED);
		int daysRequested = calculateDaysBetween(leaveRequest.getStartDate(), leaveRequest.getEndDate());
		Employee employee = leaveRequest.getEmployee();
		if (LeaveType.ANNUAL_LEAVE.equals(leaveRequest.getLeaveType())) {
			if(daysRequested > employee.getAnnualLeave()) {
				throw new AppException(ErrorCode.INSUFFICIENT_CASUAL_LEAVE_BALANCE);
			}
			employee.setUsedLeave(employee.getUsedLeave() + daysRequested);
		}
		else if (LeaveType.SICK_LEAVE.equals(leaveRequest.getLeaveType())) {
			employee.setUsedSickLeaveDays(employee.getUsedSickLeaveDays() + daysRequested);
		}
		else if (LeaveType.MATERNITY_LEAVE.equals(leaveRequest.getLeaveType())) {
			employee.setMaternityStartDate(leaveRequest.getStartDate().toLocalDate());
			employee.setMaternityEndDate(leaveRequest.getEndDate().toLocalDate());
		}
		else if (LeaveType.PERSONAL_LEAVE.equals(leaveRequest.getLeaveType())) {
			employee.setUsedPersonalLeaveDays(employee.getUsedPersonalLeaveDays() + daysRequested);
		}
		employeeRepository.save(employee);
		createTimeSheetsForLeaveRequest(leaveRequest);
		return leaveRequestMapper.toLeaveRequestResponse(leaveRequestRepository.save(leaveRequest));
	}
	private void createTimeSheetsForLeaveRequest(LeaveRequest leaveRequest) {
		LocalDate startDate = leaveRequest. getStartDate().toLocalDate();
		LocalDate endDate = leaveRequest.getEndDate().toLocalDate();
		Employee employee = leaveRequest.getEmployee();

		List<TimeSheet> timesheets = new ArrayList<>();

		LocalDate currentDate = startDate;
		while (! currentDate.isAfter(endDate)) {

			DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
			if (dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY) {

				boolean exists = timeSheetRepository.existsByEmployeeIdAndWorkDate(
						employee.getId(),
						currentDate
				);

				if (!exists) {
					TimeSheet timesheet = TimeSheet.builder()
							.employee(employee)
							.workDate(currentDate)
							.checkIn(LocalTime.of(8, 0))
							.checkOut(LocalTime.of(17, 0))
							.type(TimeSheetType.LEAVE_REQUEST)
							.workHours(BigDecimal.valueOf(8))
							.lateMinutes(0)
							.lateDeductionRate(BigDecimal.ZERO)
							.request(leaveRequest)
							.createdAt(LocalDateTime.now())
							.build();
					timesheets.add(timesheet);
				}
			}
			currentDate = currentDate.plusDays(1);
		}

		if (!timesheets.isEmpty()) {
			timeSheetRepository.saveAll(timesheets);
			log.info("Created {} timesheets for leave request {}",
					timesheets. size(), leaveRequest.getId());
		}
	}
	@Override
	public RequestResponse getRequestById(Long requestId) {
		return leaveRequestMapper.toLeaveRequestResponse(
				leaveRequestRepository.findById(requestId)
						.orElseThrow(() -> new AppException(ErrorCode.LEAVE_REQUEST_NOT_FOUND))
		);
	}
}

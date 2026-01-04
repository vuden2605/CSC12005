package com.csc12005.hr.Service.RequestService.Provider;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Enums.RequestType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.RequestMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.RequestRepository;
import com.csc12005.hr.Service.S3Service.IS3Service;
import com.csc12005.hr.Service.S3Service.Impl.S3Service;
import com.csc12005.hr.Utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;

@RequiredArgsConstructor
public abstract class AbstractRequestProvider implements IRequestProvider{
	protected final SecurityUtils securityUtils;
	protected final EmployeeRepository employeeRepository;
	private final IS3Service s3Service;
	private final RequestMapper requestMapper;
	private final RequestRepository requestRepository;
	protected final ApplicationEventPublisher eventPublisher;

	@Override
	public abstract RequestType getRequestType();

	@Override
	public RequestResponse createRequest(RequestCreationRequest request) {

		Long employeeId = securityUtils.getCurrentUserId();
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

		String attachmentUrl = request.getFile() != null
				? s3Service.uploadFile(request.getFile())
				: null;

		return doCreateRequest(request, employee, attachmentUrl);
	}

	@Override
	public RequestResponse rejectRequest(Long requestId) {
		Request request = requestRepository.findById(requestId)
				.orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_FOUND));
		request.setStatus(RequestStatus.REJECTED);
		return requestMapper.toRequestResponse(requestRepository.save(request));
	}

	protected abstract RequestResponse doCreateRequest(
			RequestCreationRequest request,
			Employee employee,
			String attachmentUrl
	);
	protected <T extends Request> void setCommonFields(
			T request,
			Employee employee,
			String attachmentUrl,
			RequestType requestType
	) {
		request.setEmployee(employee);
		request.setRequestAttachment(attachmentUrl);
		request.setRequestType(requestType);
	}
	protected void validateDateRange(LocalDateTime startDate, LocalDateTime endDate) {
		if (startDate == null) {
			throw new AppException(ErrorCode.REQUIRED_START_DATE);
		}
		if (endDate == null) {
			throw new AppException(ErrorCode.REQUIRED_END_DATE);
		}
		if (startDate.isAfter(endDate)) {
			throw new AppException(ErrorCode.INVALID_DATE_RANGE);
		}
		if (startDate.isBefore(LocalDateTime.now())) {
			throw new AppException(ErrorCode.CANNOT_REQUEST_PAST_DATE);
		}
	}
	protected void validateWorkDate(LocalDate workDate) {
		if (workDate == null) {
			throw new AppException(ErrorCode.REQUIRED_WORK_DATE);
		}

		if (workDate.isBefore(LocalDate.now().minusDays(7))) {
			throw new AppException(ErrorCode.WORK_DATE_TOO_OLD);
		}
		if (workDate.isAfter(LocalDate.now())) {
			throw new AppException(ErrorCode.CANNOT_REQUEST_FUTURE_DATE);
		}
	}
	protected int calculateDaysBetween(LocalDateTime start, LocalDateTime end) {
		LocalDate startDate = start.toLocalDate();
		LocalDate endDate = end.toLocalDate();

		int days = 0;
		LocalDate current = startDate;

		while (!current.isAfter(endDate)) {
			DayOfWeek dayOfWeek = current.getDayOfWeek();

			if (dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY) {
				days++;
			}

			current = current.plusDays(1);
		}
		return days;
	}

}

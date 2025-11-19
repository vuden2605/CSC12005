package com.csc12005.hr.Service.WFHRequestService.Impl;

import com.csc12005.hr.DTO.Request.WFHCreationRequest;
import com.csc12005.hr.DTO.Response.WFHResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Entity.WFHRequest;
import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Enums.RequestType;
import com.csc12005.hr.Enums.TimeSheetStatus;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.WFHRequestMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.TimeSheetRepository;
import com.csc12005.hr.Repository.WFhRequestRepository;
import com.csc12005.hr.Service.WFHRequestService.IWFHRequestService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WFHRequestService implements IWFHRequestService {
	private final WFHRequestMapper wfhRequestMapper;
	private final WFhRequestRepository wFhRequestRepository;
	private final EmployeeRepository employeeRepository;
	private final TimeSheetRepository timeSheetRepository;
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

	@Override
	public List<WFHResponse> getAllWFHRequests() {
		List<WFHRequest> wfhRequests = wFhRequestRepository.findAll();
		return wfhRequests.stream().map(wfhRequestMapper::toWFHResponse).toList();
	}

	@Override
	@Transactional
	public WFHResponse approveWFHRequest(Long requestId) {
		WFHRequest wfhRequest = wFhRequestRepository.findById(requestId)
				.orElseThrow(() -> new AppException(ErrorCode.WFH_REQUEST_NOT_FOUND));
		LocalDate startDate = wfhRequest.getStartDate();
		LocalDate endDate = wfhRequest.getEndDate();
		int days = (int) (endDate.toEpochDay() - startDate.toEpochDay()) + 1;
		List<TimeSheet> timeSheets = new ArrayList<>();
		for (int i = 0; i < days; i++) {
			TimeSheet timeSheet = TimeSheet.builder()
					.employee(wfhRequest.getEmployee())
					.workDate(startDate.plusDays(i))
					.checkIn(LocalTime.parse("08:00:00"))
					.checkOut(LocalTime.parse("17:00:00"))
					.status(TimeSheetStatus.WFH)
					.build();
			timeSheets.add(timeSheet);
		}
		wfhRequest.setStatus(RequestStatus.APPROVED);
		WFHRequest savedRequest = wFhRequestRepository.save(wfhRequest);
		timeSheetRepository.saveAll(timeSheets);
		return wfhRequestMapper.toWFHResponse(savedRequest);
	}

	@Override
	public WFHResponse rejectWFHRequest(Long requestId) {
		WFHRequest wfhRequest = wFhRequestRepository.findById(requestId)
				.orElseThrow(() -> new AppException(ErrorCode.WFH_REQUEST_NOT_FOUND));
		wfhRequest.setStatus(RequestStatus.APPROVED);
		return wfhRequestMapper.toWFHResponse(wFhRequestRepository.save(wfhRequest));
	}
}

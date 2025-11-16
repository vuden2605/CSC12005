package com.csc12005.hr.Service.TimeSheetService.Impl;

import com.csc12005.hr.DTO.Request.TimeSheetCreationRequest;
import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.TimeSheetResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.TimeSheetMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.TimeSheetRepository;
import com.csc12005.hr.Service.TimeSheetService.ITimeSheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TimeSheetService implements ITimeSheetService {
	private final TimeSheetRepository timeSheetRepository;
	private final TimeSheetMapper timeSheetMapper;
	private final EmployeeRepository employeeRepository;
	public TimeSheetResponse createTimeSheet(TimeSheetCreationRequest timeSheetCreationRequest) {
		TimeSheet timeSheet = timeSheetMapper.toTimeSheet(timeSheetCreationRequest);
		var context = SecurityContextHolder.getContext();
		var employeeId = context.getAuthentication().getName();
		Employee employee = employeeRepository.findById(Long.parseLong(employeeId))
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		timeSheet.setEmployee(employee);
		TimeSheet savedTimeSheet = timeSheetRepository.save(timeSheet);
		return timeSheetMapper.toTimeSheetResponse(savedTimeSheet);
	}
}

package com.csc12005.hr.Service.RequestAuthService.Impl;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.RequestRepository;
import com.csc12005.hr.Service.RequestAuthService.IRequestAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service("requestAuthService")
@RequiredArgsConstructor
@Slf4j
public class RequestAuthService implements IRequestAuthService {
	private final RequestRepository requestRepository;
	@Override
	public boolean canApproveOrRejectRequest(Long requestId, String username) {
		long employeeId = Long.parseLong(username);
		Request request = requestRepository.findByIdWithEmployeeAndManager(requestId)
				.orElseThrow(() -> new AppException(ErrorCode.REQUEST_NOT_FOUND));
		Employee manager = request.getEmployee().getManager();
		log.info("Manager ID: {}, Employee ID: {}", manager != null ? manager.getId() : null, employeeId);
		if (manager == null) {
			return false;
		}
		return manager.getId().equals(employeeId);
	}

}

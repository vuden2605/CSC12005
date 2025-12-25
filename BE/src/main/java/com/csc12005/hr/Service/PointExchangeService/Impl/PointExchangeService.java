package com.csc12005.hr.Service.PointExchangeService.Impl;

import com.csc12005.hr.DTO.Request.PointExchangeRequest;
import com.csc12005.hr.DTO.Request.UpdatePointExchangeStatusRequest;
import com.csc12005.hr.DTO.Response.PointExchangeResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.PointExchange;
import com.csc12005.hr.Enums.PointExchangeStatus;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.PointExchangeMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.PointExchangeRepository;
import com.csc12005.hr.Service.PointExchangeService.IPointExchangeService;
import com.csc12005.hr.Utils.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PointExchangeService implements IPointExchangeService {
	private final PointExchangeRepository pointExchangeRepository;
	private final PointExchangeMapper pointExchangeMapper;
	private final SecurityUtils securityUtils;
	private final EmployeeRepository employeeRepository;
	@Override
	public PointExchangeResponse requestExchangePoints(PointExchangeRequest request) {
		Long employeeId = securityUtils.getCurrentUserId();
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		PointExchange pointExchange = PointExchange.builder()
				.employee(employee)
				.pointUsed(request.getPoints())
				.exchangeValue(request.getPoints() * 2000)
				.status(PointExchangeStatus.PENDING)
				.note("Requesting point exchange")
				.build();
		PointExchange savedPointExchange = pointExchangeRepository.save(pointExchange);
		return pointExchangeMapper.toPointExchangeResponse(savedPointExchange);
	}
	@Transactional
	public PointExchangeResponse updatePointExchangeStatus(
			Long exchangeId,
			UpdatePointExchangeStatusRequest request
	) {
		PointExchange exchange = pointExchangeRepository.findById(exchangeId)
				.orElseThrow(() -> new AppException(ErrorCode.POINT_EXCHANGE_NOT_FOUND));

		PointExchangeStatus currentStatus = exchange.getStatus();
		PointExchangeStatus newStatus = request.getStatus();
		validateStatusTransition(currentStatus, newStatus);

		switch (newStatus) {
			case APPROVED -> {
				exchange.setApprovedAt(LocalDateTime.now());
			}

			case COMPLETED -> {
				Employee employee = exchange.getEmployee();
				Long pointUsed = exchange.getPointUsed();

				if (employee.getTotalPoints() < pointUsed) {
					throw new AppException(ErrorCode.INSUFFICIENT_POINTS);
				}

				employee.setTotalPoints(employee.getTotalPoints() - pointUsed);
				exchange.setCompletedAt(LocalDateTime.now());
				employeeRepository.save(employee);
			}

			case REJECTED -> {
				exchange.setRejectedAt(LocalDateTime.now());
			}

			default -> throw new AppException(ErrorCode.INVALID_STATUS);
		}

		exchange.setStatus(newStatus);
		return pointExchangeMapper.toPointExchangeResponse(
				pointExchangeRepository.save(exchange)
		);
	}
	private void validateStatusTransition(
			PointExchangeStatus currentStatus,
			PointExchangeStatus newStatus
	) {
		if (currentStatus == PointExchangeStatus.REJECTED ||
				currentStatus == PointExchangeStatus.COMPLETED) {
			throw new AppException(ErrorCode.POINT_EXCHANGE_FINAL_STATE);
		}
		if (currentStatus == PointExchangeStatus.PENDING &&
				newStatus == PointExchangeStatus.COMPLETED) {
			throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
		}
	}

}

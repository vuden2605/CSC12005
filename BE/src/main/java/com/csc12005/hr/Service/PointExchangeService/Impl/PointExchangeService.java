package com.csc12005.hr.Service.PointExchangeService.Impl;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.PointExchangeFilterRequest;
import com.csc12005.hr.DTO.Request.PointExchangeRequest;
import com.csc12005.hr.DTO.Request.UpdatePointExchangeStatusRequest;
import com.csc12005.hr.DTO.Response.PointExchangeResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.PointExchange;
import com.csc12005.hr.Entity.PointHistory;
import com.csc12005.hr.Enums.PointExchangeStatus;
import com.csc12005.hr.Enums.PointReasonDescription;
import com.csc12005.hr.Enums.PointReasonType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.PointExchangeMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.PointExchangeRepository;
import com.csc12005.hr.Repository.PointHistoryRepository;
import com.csc12005.hr.Service.PointExchangeService.IPointExchangeService;
import com.csc12005.hr.Utils.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointExchangeService implements IPointExchangeService {
	private final PointExchangeRepository pointExchangeRepository;
	private final PointExchangeMapper pointExchangeMapper;
	private final SecurityUtils securityUtils;
	private final EmployeeRepository employeeRepository;
	private final PointHistoryRepository pointHistoryRepository;
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
				.build();
		PointExchange savedPointExchange = pointExchangeRepository.save(pointExchange);
		return pointExchangeMapper.toPointExchangeResponse(savedPointExchange);
	}
	@Transactional
	public List<PointExchangeResponse> updatePointExchangeStatus(
			UpdatePointExchangeStatusRequest request
	) {
		List<PointExchange> exchanges= pointExchangeRepository.findAllById(request.getPointExchangeIds());
		if (exchanges.size() != request.getPointExchangeIds().size()) {
			throw new AppException(ErrorCode.POINT_EXCHANGE_NOT_FOUND);
		}
		for (PointExchange exchange : exchanges) {
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


					PointHistory history = PointHistory.builder()
							.employee(employee)
							.pointChange(-pointUsed)
							.reasonType(PointReasonType.EXCHANGE)
							.referenceId(exchange.getId())
							.description(PointReasonDescription.EXCHANGE.getDescription())
							.build();
					employeeRepository.save(employee);
					pointHistoryRepository.save(history);
				}

				case REJECTED -> {
					exchange.setRejectedAt(LocalDateTime.now());
				}

				default -> throw new AppException(ErrorCode.INVALID_STATUS);
			}

			exchange.setStatus(newStatus);
		}

		List<PointExchange> updatedExchanges = pointExchangeRepository.saveAll(exchanges);
		return updatedExchanges.stream()
				.map(pointExchangeMapper::toPointExchangeResponse)
				.toList();
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
	public Page<PointExchangeResponse> myPointExchanges(PageRequestDTO pageRequestDTO, PointExchangeFilterRequest pointExchangeFilterRequest) {
		Long employeeId = securityUtils.getCurrentUserId();
		Pageable pageable = pageRequestDTO.buildPageable();
		Page<PointExchange> pointExchanges = pointExchangeRepository.filterPointExchanges(
				employeeId,
				pointExchangeFilterRequest.getEmployeeName(),
				pointExchangeFilterRequest.getEmployeeCode(),
				pointExchangeFilterRequest.getStatus(),
				pointExchangeFilterRequest.getStartDate(),
				pointExchangeFilterRequest.getEndDate(),
				pageable
		);
		return pointExchanges.map(pointExchangeMapper::toPointExchangeResponse);
	}

	@Override
	public Page<PointExchangeResponse> getAllExchanges(PageRequestDTO pageRequestDTO, PointExchangeFilterRequest pointExchangeFilterRequest) {
		Pageable pageable = pageRequestDTO.buildPageable();
		Page<PointExchange> pointExchanges = pointExchangeRepository.filterPointExchanges(
				null,
				pointExchangeFilterRequest.getEmployeeName(),
				pointExchangeFilterRequest.getEmployeeCode(),
				pointExchangeFilterRequest.getStatus(),
				pointExchangeFilterRequest.getStartDate(),
				pointExchangeFilterRequest.getEndDate(),
				pageable
		);
		return pointExchanges.map(pointExchangeMapper::toPointExchangeResponse);
	}
}

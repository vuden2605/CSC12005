package com.csc12005.hr.Service.PointHistoryService.Impl;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.PointHistoryResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.PointHistory;
import com.csc12005.hr.Enums.PointReasonDescription;
import com.csc12005.hr.Enums.PointReasonType;
import com.csc12005.hr.Mapper.EmployeeMapper;
import com.csc12005.hr.Mapper.PointHistoryMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.PointHistoryRepository;
import com.csc12005.hr.Service.PointHistoryService.IPointHistoryService;
import com.csc12005.hr.Utils.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointHistoryService implements IPointHistoryService {
	private final PointHistoryRepository pointHistoryRepository;
	private final EmployeeMapper employeeMapper;
	private final EmployeeRepository employeeRepository;
	private final SecurityUtils securityUtils;
	private final PointHistoryMapper pointHistoryMapper;
	@Override
	public List<EmployeeResponse> getMonthlyCandidates() {
		LocalDate now = LocalDate.now();
		LocalDateTime firstDayOfMonth = now.withDayOfMonth(1).atStartOfDay();
		LocalDateTime firstDayOfNextMonth = now.plusMonths(1).withDayOfMonth(1).atStartOfDay();
		List<Employee> candidates = pointHistoryRepository.getMonthlyCandidates(firstDayOfMonth, firstDayOfNextMonth);
		return candidates.stream().map(employeeMapper::toEmployeeResponse).toList();
	}
	@Transactional
	@Override
	public void givePointToMonthlyCandidates(List<Long> candidateIds) {
		if(candidateIds.isEmpty()) {
			return;
		}
		List<Employee> candidates = employeeRepository.findAllById(candidateIds);
		List<PointHistory> pointHistories = new ArrayList<>();
		for (Employee candidate : candidates) {
			Long pointChange = candidate.getPosition().getPoint();
			candidate.setTotalPoints(candidate.getTotalPoints() + pointChange);
			PointHistory pointHistory = PointHistory.builder()
					.employee(candidate)
					.pointChange(pointChange)
					.reasonType(PointReasonType.MONTHLY_GRANT)
					.description(PointReasonDescription.ACTIVITY_BONUS.getDescription())
					.build();
			pointHistories.add(pointHistory);
		}
		pointHistoryRepository.saveAll(pointHistories);
		employeeRepository.saveAll(candidates);
	}

	@Override
	public int getTotalReceivedPointsInMonth() {
		Long employeeId = securityUtils.getCurrentUserId();
		return pointHistoryRepository.sumReceivedPointsByEmployeeIdInMonth(employeeId);
	}

	@Override
	public int getTotalReceivedPointsInYear() {
		Long employeeId = securityUtils.getCurrentUserId();
		return pointHistoryRepository.sumReceivedPointsByEmployeeIdInYear(employeeId);
	}

	@Override
	public int getCurrentTotalPoints() {
		Long employeeId = securityUtils.getCurrentUserId();
		return pointHistoryRepository.sumPointChangeByEmployeeIdInMonth(employeeId);
	}

	public List<PointHistoryResponse> myPointsHistory(PageRequestDTO pageRequestDTO) {
		Pageable pageable = pageRequestDTO.buildPageable();
		Long employeeId = securityUtils.getCurrentUserId();
		List<PointHistory> pointHistories = pointHistoryRepository.findByEmployeeId(employeeId, pageable);
		return pointHistories.stream()
				.map(pointHistoryMapper::toPointHistoryResponse)
				.toList();
	}
}

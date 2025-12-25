package com.csc12005.hr.Service.PointHistoryService.Impl;

import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.PointHistory;
import com.csc12005.hr.Enums.PointReasonType;
import com.csc12005.hr.Mapper.EmployeeMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.PointHistoryRepository;
import com.csc12005.hr.Service.PointHistoryService.IPointHistoryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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
			PointHistory pointHistory = PointHistory.builder()
					.employee(candidate)
					.pointChange(pointChange)
					.reasonType(PointReasonType.MONTHLY_GRANT)
					.description("Monthly candidate point grant")
					.build();
			pointHistories.add(pointHistory);
		}
		pointHistoryRepository.saveAll(pointHistories);
	}
}

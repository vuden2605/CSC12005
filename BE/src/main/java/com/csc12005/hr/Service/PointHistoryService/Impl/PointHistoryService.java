package com.csc12005.hr.Service.PointHistoryService.Impl;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.PointHistoryFilterRequest;
import com.csc12005.hr.DTO.Request.RewardPointRequest;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.PointHistoryResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.PointHistory;
import com.csc12005.hr.Enums.PointReasonDescription;
import com.csc12005.hr.Enums.PointReasonType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.EmployeeMapper;
import com.csc12005.hr.Mapper.PointHistoryMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.PointHistoryRepository;
import com.csc12005.hr.Service.PointHistoryService.IPointHistoryService;
import com.csc12005.hr.Utils.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
	private final PointHistoryMapper pointHistoryMapper;
	private final SecurityUtils securityUtils;
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
	public void givePointToMonthlyCandidates(List<Employee> employees) {
		if(employees.isEmpty()) {
			return;
		}
		List<PointHistory> pointHistories = new ArrayList<>();
		for (Employee candidate : employees) {
			Long pointChange = candidate.getPosition().getPoint();
			candidate.setTotalPoints(candidate.getTotalPoints() + pointChange);
			PointHistory pointHistory = PointHistory.builder()
					.employee(candidate)
					.pointChange(pointChange)
					.reasonType(PointReasonType.MONTHLY_GRANT)
					.description(PointReasonDescription.MONTHLY_GRANT.getDescription())
					.build();
			pointHistories.add(pointHistory);
		}
		pointHistoryRepository.saveAll(pointHistories);
	}
	@Override
	public int getTotalReceivedPointsInMonth(Long userId) {

		return pointHistoryRepository.sumReceivedPointsByEmployeeIdInMonth(userId);
	}
	@Override
	public int getTotalReceivedPointsInYear(Long userId) {
		return pointHistoryRepository.sumReceivedPointsByEmployeeIdInYear(userId);
	}
	@Override
	public int getCurrentTotalPoints(Long userId) {
		return pointHistoryRepository.sumPointChangeByEmployeeIdInMonth(userId);
	}

	public List<PointHistoryResponse> getPointHistoriesByEmployee(Long employeeId, PointHistoryFilterRequest filterRequest , PageRequestDTO pageRequestDTO) {
		Pageable pageable = pageRequestDTO.buildPageable();
		List<PointHistory> pointHistories = pointHistoryRepository.findByEmployeeId(employeeId,filterRequest.getType(), filterRequest.getYear(), filterRequest.getMonth(),pageable);
		return pointHistories.stream()
				.map(pointHistoryMapper::toPointHistoryResponse)
				.toList();
	}
	@Transactional
	public void rewardPoints(RewardPointRequest request) {
		List<Employee> employees = employeeRepository.findAllById(request.getEmployeeId());
		List<PointHistory> pointHistories = new ArrayList<>();
		if(employees.isEmpty() || employees.size() != request.getEmployeeId().size()) {
			throw new AppException(ErrorCode.EMPLOYEE_NOT_FOUND);
		}
		Long currentUserId = securityUtils.getCurrentUserId();
		Employee rewardedBy = employeeRepository.findById(currentUserId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		if(rewardedBy.getAllocatePoints() > 0 && rewardedBy.getAllocatePoints() >= (long) request.getPoints() *employees.size()) {
			for(Employee employee : employees) {
				employee.setTotalPoints(employee.getTotalPoints() + request.getPoints());
				rewardedBy.setAllocatePoints(rewardedBy.getAllocatePoints() - request.getPoints());
				PointHistory pointHistory = PointHistory.builder()
						.employee(employee)
						.pointChange(request.getPoints().longValue())
						.reasonType(PointReasonType.REWARD)
						.referenceId(rewardedBy.getId())
						.description("Điểm thưởng từ trưởng phòng")
						.build();
				pointHistories.add(pointHistory);
			}
			employeeRepository.saveAll(employees);
			employeeRepository.save(rewardedBy);
			pointHistoryRepository.saveAll(pointHistories);
		} else {
			throw new AppException(ErrorCode.INSUFFICIENT_ALLOCATE_POINTS);
		}

	}
}

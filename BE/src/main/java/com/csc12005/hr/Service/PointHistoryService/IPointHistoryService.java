package com.csc12005.hr.Service.PointHistoryService;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.PointHistoryFilterRequest;
import com.csc12005.hr.DTO.Request.RewardPointRequest;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.PointHistoryResponse;
import com.csc12005.hr.Entity.Employee;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IPointHistoryService {
	List<EmployeeResponse> getMonthlyCandidates();
	void givePointToMonthlyCandidates(List<Employee> candidateIds);
	int getTotalReceivedPointsInMonth(Long userId);
	int getTotalReceivedPointsInYear(Long userId);
	int getCurrentTotalPoints(Long userId);
	void rewardPoints(RewardPointRequest request);
	List<PointHistoryResponse> getPointHistoriesByEmployee(Long employeeId, PointHistoryFilterRequest filterRequest , PageRequestDTO pageRequestDTO);
}

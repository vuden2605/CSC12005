package com.csc12005.hr.Service.PointHistoryService;

import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.Entity.Employee;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IPointHistoryService {
	List<EmployeeResponse> getMonthlyCandidates();
	void givePointToMonthlyCandidates(List<Long> candidateIds);
	int getTotalReceivedPointsInMonth(Long userId);
	int getTotalReceivedPointsInYear(Long userId);
	int getCurrentTotalPoints(Long userId);
}

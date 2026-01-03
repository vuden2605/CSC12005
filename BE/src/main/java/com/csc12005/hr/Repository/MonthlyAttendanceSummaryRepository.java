package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.MonthlyAttendanceSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MonthlyAttendanceSummaryRepository extends JpaRepository<MonthlyAttendanceSummary, Long> {
	Optional<MonthlyAttendanceSummary> findByEmployeeIdAndMonthAndYear(Long employeeId, Integer month, Integer year);
}

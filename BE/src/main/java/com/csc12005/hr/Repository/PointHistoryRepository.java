package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.PointHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PointHistoryRepository extends JpaRepository<PointHistory, Long> {
	@Query("""
    SELECT e
	FROM Employee e
	WHERE e.employeeCode NOT IN ('ADMIN', 'CEO')
    AND NOT EXISTS (
        SELECT 1
        FROM PointHistory ph
        WHERE ph.employee = e
          AND ph.reasonType = 'MONTHLY_GRANT'
          AND ph.createdAt >= :startDate
          AND ph.createdAt < :endDate
    )
""")
	List<Employee> getMonthlyCandidates(
			@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate
	);
	List<PointHistory> findByEmployeeId(Long employeeId, Pageable pageable);
}

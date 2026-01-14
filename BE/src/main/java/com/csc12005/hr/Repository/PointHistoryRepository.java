package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.PointHistory;
import com.csc12005.hr.Enums.PointReasonType;
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
	@Query(
	"""
		SELECT ph
		FROM PointHistory ph
		WHERE ph.employee.id = :employeeId
		  AND (:reasonType IS NULL OR ph.reasonType = :reasonType)
		  AND (:year IS NULL OR FUNCTION('YEAR', ph.createdAt) = :year)
		  AND (:month IS NULL OR FUNCTION('MONTH', ph.createdAt) = :month)
		
	"""
	)
	List<PointHistory> findByEmployeeId(
			@Param("employeeId") Long employeeId,
			@Param("reasonType") PointReasonType reasonType,
			@Param("year") Integer year,
			@Param("month") Integer month,
			Pageable pageable);
	@Query("""
	SELECT COALESCE(SUM(ph.pointChange), 0)
	FROM PointHistory ph
	WHERE ph.employee.id = :employeeId
	  AND ph.pointChange > 0
	  AND FUNCTION('MONTH', ph.createdAt) = FUNCTION('MONTH', CURRENT_DATE)
	  AND FUNCTION('YEAR', ph.createdAt) = FUNCTION('YEAR', CURRENT_DATE)
	""")
	int sumReceivedPointsByEmployeeIdInMonth(@Param("employeeId") Long employeeId);

	@Query("""
	SELECT COALESCE(SUM(ph.pointChange), 0)
	FROM PointHistory ph
	WHERE ph.employee.id = :employeeId
	  AND ph.pointChange > 0
	  AND FUNCTION('YEAR', ph.createdAt) = FUNCTION('YEAR', CURRENT_DATE)
	""")
	int sumReceivedPointsByEmployeeIdInYear(@Param("employeeId") Long employeeId);

	@Query("""	
		SELECT COALESCE(SUM(ph.pointChange), 0)
		FROM PointHistory ph
		WHERE ph.employee.id = :employeeId 
	""")
	int sumPointChangeByEmployeeIdInMonth(@Param("employeeId") Long employeeId);
}

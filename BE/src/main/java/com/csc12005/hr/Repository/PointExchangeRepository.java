package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.PointExchange;
import com.csc12005.hr.Enums.PointExchangeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Repository
public interface PointExchangeRepository extends JpaRepository<PointExchange, Long> {
	@Query("""
			SELECT pe FROM PointExchange pe
			JOIN pe.employee e
			WHERE (:employeeName IS NULL OR LOWER(e.fullName) LIKE LOWER(CONCAT('%', :employeeName, '%')))
			AND (:employeeCode IS NULL OR LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :employeeCode, '%')))
			AND (:status IS NULL OR pe.status = :status)
			AND (:startDate IS NULL OR pe.requestedAt >= :startDate)
			AND (:endDate IS NULL OR pe.requestedAt <= :endDate)
			AND (:employeeId IS NULL OR e.id = :employeeId)
			AND pe.status <> 'REJECTED'
			""")
	Page<PointExchange> filterPointExchanges(
			@Param("employeeId") Long employeeId,
			@Param("employeeName") String employeeName,
			@Param("employeeCode") String employeeCode,
			@Param("status") PointExchangeStatus status,
			@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate,
			Pageable pageable
	);
}

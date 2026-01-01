package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Enums.RequestType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
	@Query("""
    SELECT r
    FROM Request r
    WHERE (:status IS NULL OR r.status = :status)
      AND (:requestType IS NULL OR r.requestType = :requestType)
      AND (:startDate IS NULL OR r.createdAt >= :startDate)
      AND (:endDate IS NULL OR r.createdAt < :endDate)
      AND (r.employee.manager.id = :employeeId)
""")
	Page<Request> getRequestByManager(Pageable pageable,
	                         @Param("status") RequestStatus status,
	                         @Param("requestType") RequestType requestType,
	                         @Param("startDate") LocalDateTime startDate,
	                         @Param("endDate") LocalDateTime endDate,
	                         @Param("employeeId") Long employeeId);
	@Query("""
    SELECT r
    FROM Request r
    WHERE (:status IS NULL OR r.status = :status)
      AND (:requestType IS NULL OR r.requestType = :requestType)
      AND (:startDate IS NULL OR r.createdAt >= :startDate)
      AND (:endDate IS NULL OR r.createdAt < :endDate)
      AND r.employee.id = :employeeId
""")
	Page<Request> myRequests(Pageable pageable,
	                         @Param("status") RequestStatus status,
	                         @Param("requestType") RequestType requestType,
	                         @Param("startDate") LocalDateTime startDate,
	                         @Param("endDate") LocalDateTime endDate,
	                         @Param("employeeId") Long employeeId);
	@Query("SELECT r FROM Request r " +
			"JOIN FETCH r.employee e " +
			"LEFT JOIN FETCH e.manager m " +
			"WHERE r.id = :requestId")
	Optional<Request> findByIdWithEmployeeAndManager(@Param("requestId") Long requestId);
}

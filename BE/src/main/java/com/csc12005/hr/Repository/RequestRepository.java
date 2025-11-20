package com.csc12005.hr.Repository;

import com.csc12005.hr.DTO.Request.RequestFilter;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Request;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
	@Query("""
    SELECT r
    FROM Request r
    WHERE (:status IS NULL OR r.status = :status)
      AND (:requestType IS NULL OR r.requestType = :requestType)
      AND (:startDate IS NULL OR r.createdAt >= :startDate)
      AND (:endDate IS NULL OR r.createdAt < :endDate)
""")
	Page<Request> getRequest(Pageable pageable,
	                         @Param("status") String status,
	                         @Param("requestType") String requestType,
	                         @Param("startDate") LocalDateTime startDate,
	                         @Param("endDate") LocalDateTime endDate);
}

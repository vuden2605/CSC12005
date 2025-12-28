package com.csc12005.hr.Repository;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.Entity.TimeSheet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeSheetRepository extends JpaRepository<TimeSheet, Long> {
	Optional<TimeSheet> findByEmployeeIdAndWorkDate(Long employeeId, LocalDate workDate);
	@Query(
			"""
			SELECT ts FROM TimeSheet ts
			WHERE ts.employee.id = :employeeId
			AND (:fromDate IS NULL OR ts.workDate >= :fromDate)
			AND (:toDate IS NULL OR ts.workDate <= :toDate)
			"""
	)
	Page<TimeSheet> myTimeSheets(Long employeeId, Pageable pageable, LocalDate fromDate, LocalDate toDate);
    @Query("""
        SELECT t
        FROM TimeSheet t
        WHERE t.employee.id = :employeeId
        AND MONTH(t.workDate) = :month
        AND YEAR(t.workDate) = :year
 
    """)
    List<TimeSheet> findApprovedByEmployeeAndMonth(
            @Param("employeeId") Long employeeId,
            @Param("month") Long month,
            @Param("year") Long year
    );

}

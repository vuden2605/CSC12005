package com.csc12005.hr.Repository;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.MonthlyAttendanceAggResponse;
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
	boolean existsByEmployeeIdAndWorkDate(Long employeeId, LocalDate workDate);
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

	@Query("""
	SELECT new com.csc12005.hr.DTO.Response.MonthlyAttendanceAggResponse(
		ts.employee.id,
		YEAR(ts.workDate),
		MONTH(ts.workDate),
		COUNT(DISTINCT ts.workDate),
		SUM(
			CASE 
				WHEN ts.type = com.csc12005.hr.Enums.TimeSheetType.LATE 
				THEN 1 ELSE 0 
			END
		),
		COALESCE(SUM(ts.workHours), 0.0),
		COALESCE(SUM(
			CASE 
				WHEN ts.type = com.csc12005.hr.Enums.TimeSheetType.OVERTIME
				THEN ts.workHours
				ELSE 0.0
			END
		), 0.0)
	)
	FROM TimeSheet ts
	WHERE ts.employee.id = :employeeId
	  AND YEAR(ts.workDate) = :year
	  AND MONTH(ts.workDate) = :month
	GROUP BY ts.employee.id, YEAR(ts.workDate), MONTH(ts.workDate)
""")
	MonthlyAttendanceAggResponse aggregateMonthlyAttendance(
			@Param("employeeId") Long employeeId,
			@Param("year") int year,
			@Param("month") int month
	);
	@Query("""
	SELECT ts
	FROM TimeSheet ts
	WHERE ts.employee.id = :employeeId
	  AND YEAR(ts.workDate) = :year
	  AND MONTH(ts.workDate) = :month
""")
	List<TimeSheet> findTimesheetsByMonth(
			@Param("employeeId") Long employeeId,
			@Param("year") int year,
			@Param("month") int month
	);
}

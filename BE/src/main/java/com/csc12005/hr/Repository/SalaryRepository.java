package com.csc12005.hr.Repository;

import com.csc12005.hr.DTO.Response.SalaryResponse;
import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Entity.Salary;
import com.csc12005.hr.Enums.SalaryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaryRepository extends JpaRepository<Salary,Long> {
    @Query("""
SELECT new com.csc12005.hr.DTO.Response.SalaryResponse(
    s.id,
    s.year,
    s.month,
    s.baseSalary,
    s.actualSalary,
	s.lateDeduction,
	s.positionAllowance,
	s.transportAllowance,
	s.mealAllowance,
	s.socialInsurance,
	s.healthInsurance,
	s.unemploymentInsurance,
	s.totalInsurance,
	s.taxableIncome,
	s.personalIncomeTax,
	s.grossSalary,
	s.totalDeductions,
	s.netSalary,
	s.status,
	s.approvedAt,
	s.paidAt,
	s.payslipUrl,
	e.fullName,
	e.employeeCode,
	e.id,
	p.positionName,
	new com.csc12005.hr.DTO.Response.MonthlyAttendanceSummaryResponse(
	    s.attendanceSummary.id,
	    s.attendanceSummary.totalWorkDays,
	    s.attendanceSummary.totalAbsentDays,
	    s.attendanceSummary.totalLateDays,
	    s.attendanceSummary.totalWorkHours,
	    s.attendanceSummary.totalOvertimeHours,
	    s.attendanceSummary.overtimePay,
	    s.attendanceSummary.status
	)
)
FROM Salary s
JOIN s.employee e
LEFT JOIN e.position p
WHERE (:status IS NULL OR s.status = :status)
  AND (:month IS NULL OR s.month = :month)
  AND (:year IS NULL OR s.year = :year)
  AND (:employeeName IS NULL 
       OR LOWER(e.fullName) LIKE LOWER(CONCAT('%', :employeeName, '%')))
  ORDER BY s.year DESC, s.month DESC
""")
    Page<SalaryResponse> filterSalaries(
            @Param("status") SalaryStatus status,
            @Param("month") Integer month,
            @Param("year") Integer year,
            @Param("employeeName") String employeeName,
            Pageable pageable
    );
    @Query("""
    SELECT new com.csc12005.hr.DTO.Response.SalaryResponse(
    s.id,
    s.year,
    s.month,
    s.baseSalary,
    s.actualSalary,
	s.lateDeduction,
	s.positionAllowance,
	s.transportAllowance,
	s.mealAllowance,
	s.socialInsurance,
	s.healthInsurance,
	s.unemploymentInsurance,
	s.totalInsurance,
	s.taxableIncome,
	s.personalIncomeTax,
	s.grossSalary,
	s.totalDeductions,
	s.netSalary,
	s.status,
	s.approvedAt,
	s.paidAt,
	s.payslipUrl,
	e.fullName,
	e.employeeCode,
	e.id,
	p.positionName,
	new com.csc12005.hr.DTO.Response.MonthlyAttendanceSummaryResponse(
	    s.attendanceSummary.id,
	    s.attendanceSummary.totalWorkDays,
	    s.attendanceSummary.totalAbsentDays,
	    s.attendanceSummary.totalLateDays,
	    s.attendanceSummary.totalWorkHours,
	    s.attendanceSummary.totalOvertimeHours,
	    s.attendanceSummary.overtimePay,
	    s.attendanceSummary.status
	)
	)
    FROM Salary s
    JOIN s.employee e
    LEFT JOIN e.position p
    WHERE e.id = :employeeId
      AND (:status IS NULL OR s.status = :status)
      AND (:month IS NULL OR s.month = :month)
      AND (:year IS NULL OR s.year = :year)
    ORDER BY s.year DESC, s.month DESC
    """)
    Page<SalaryResponse> findMySalaries(
            @Param("employeeId") Long employeeId,
            @Param("status") SalaryStatus status,
            @Param("month") Integer month,
            @Param("year") Integer year,
            Pageable pageable
    );
    @Modifying
    @Query("""
UPDATE Salary s
SET s.status = :status
WHERE s.month = :month
  AND s.year = :year
""")
    int paySalary(@Param("month") Integer month,
                  @Param("year") Integer year,
                  @Param("status") SalaryStatus status);
    boolean existsByMonthAndYear(Integer month, Integer year);

}

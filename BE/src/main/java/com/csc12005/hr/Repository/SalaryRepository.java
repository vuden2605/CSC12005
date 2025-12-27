package com.csc12005.hr.Repository;

import com.csc12005.hr.DTO.Response.SalaryResponse;
import com.csc12005.hr.Entity.Request;
import com.csc12005.hr.Entity.Salary;
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
    s.workTime,
    s.totalPay,
    s.status,
    s.month,
    s.year,
    new com.csc12005.hr.DTO.Response.EmployeeSalaryResponse(
        e.id,
        e.fullName,
        e.email,
        p.positionName
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
            @Param("status") Boolean status,
            @Param("month") Long month,
            @Param("year") Long year,
            @Param("employeeName") String employeeName,
            Pageable pageable
    );
    @Query("""
    SELECT new com.csc12005.hr.DTO.Response.SalaryResponse(
        s.id,
        s.workTime,
        s.totalPay,
        s.status,
        s.month,
        s.year,
        new com.csc12005.hr.DTO.Response.EmployeeSalaryResponse(
            e.id,
            e.fullName,
            e.email,
            p.positionName
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
            @Param("status") Boolean status,
            @Param("month") Long month,
            @Param("year") Long year,
            Pageable pageable
    );
    @Modifying
    @Query("""
UPDATE Salary s
SET s.status = true
WHERE s.status = false
  AND s.month = :month
  AND s.year = :year
""")
    int paySalary(@Param("month") Long month,
                  @Param("year") Long year);
    boolean existsByMonthAndYear(Long month, Long year);

}

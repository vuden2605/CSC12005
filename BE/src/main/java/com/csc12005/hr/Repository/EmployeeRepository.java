package com.csc12005.hr.Repository;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Enums.SalaryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long> {
	boolean existsByEmail(String email);
	@Query("""
			SELECT COUNT(e) FROM Employee e
			WHERE YEAR(e.hireDate) = :year
			AND e.department.id = :department
	""")
	long countByYearAndDepartmentAndPosition(@Param("year")int year,
	                                         @Param("department") Long department);
	boolean existsByEmployeeCode(String employeeCode);
	Optional<Employee> findByEmployeeCode(String employeeCode);
	Page<Employee> findByManagerId(Long managerId, Pageable pageable);
    Page<Employee> findByDepartmentId(Long departmentId, Pageable pageable);
    @Query("""
 SELECT e FROM Employee e
 WHERE (:employeeName IS NULL OR LOWER(e.fullName) LIKE LOWER(CONCAT('%', :employeeName, '%')))
   AND (:departmentId IS NULL OR e.department.id = :departmentId)
   AND (:status IS NULL OR e.status = :status)
     AND e.employeeCode NOT IN ('admin', 'CEO', 'HR-HEAD')
            
""")
    Page<Employee> filterEmployee( @Param("employeeName") String employeeName,
                                   @Param("departmentId") Long departmentId,
                                   @Param("status") Boolean status,
                                   Pageable pageable);
}

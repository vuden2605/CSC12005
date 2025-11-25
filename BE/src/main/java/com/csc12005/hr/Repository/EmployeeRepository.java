package com.csc12005.hr.Repository;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.Entity.Employee;
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
			AND e.position.id = :position
	""")
	long countByYearAndDepartmentAndPosition(@Param("year")int year,
	                                         @Param("department") Long department,
	                                         @Param("position") Long position);
	boolean existsByEmployeeCode(String employeeCode);
	Optional<Employee> findByEmployeeCode(String employeeCode);
	Page<Employee> findByManagerId(Long managerId, Pageable pageable);
    Page<Employee> findByDepartmentId(Long departmentId, Pageable pageable);
}

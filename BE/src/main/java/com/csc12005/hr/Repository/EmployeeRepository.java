package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}

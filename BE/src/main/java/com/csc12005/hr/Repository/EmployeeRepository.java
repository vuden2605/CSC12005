package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Các method đã có
boolean existsByEmail(String email);

@Query("""
        SELECT COUNT(e) FROM Employee e
                WHERE YEAR(e.hireDate) = :year
                AND e.department.id = :department
                AND e.position.id = :position
""")
long countByYearAndDepartmentAndPosition(@Param("year") int year,
                                                @Param("department") Long department,
                                                @Param("position") Long position);

boolean existsByEmployeeCode(String employeeCode);

Optional<Employee> findByEmployeeCode(String employeeCode);


@Query("""
                SELECT e FROM Employee e
                LEFT JOIN FETCH e.department d
                LEFT JOIN FETCH e.position p
                WHERE d.id = :departmentId
""")
List<Employee> findByDepartmentIdWithDepartmentAndPosition(@Param("departmentId") Long departmentId);
}

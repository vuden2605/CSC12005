package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department,Long> {
	Optional<Department> findByDepartmentCode(String departmentCode);
}

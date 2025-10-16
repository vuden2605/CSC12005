package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department,Long> {
}

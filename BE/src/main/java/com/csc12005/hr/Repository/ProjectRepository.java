package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project,Long> {
	Page<Project> findByDepartmentId(Long departmentId, Pageable pageable);
	@Query("""
			SELECT p FROM Project p
			JOIN ProjectMember pm ON p.id = pm.project.id
			WHERE pm.employee.id = :userId
			""")
	Page<Project> getMyProjects(
			@Param("userId") Long userId,
			Pageable pageable);
}

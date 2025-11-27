package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.ProjectMember;
import com.csc12005.hr.Enums.ProjectMemberRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
	boolean existsByProjectIdAndEmployeeIdAndRole(Long projectId, Long employeeId, ProjectMemberRole role);
}

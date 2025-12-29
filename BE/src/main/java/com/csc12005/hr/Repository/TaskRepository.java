package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Task;
import com.csc12005.hr.Enums.TaskPriority;
import com.csc12005.hr.Enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
	List<Task> findByAssignedToId(Long userId);
	List<Task> findByProjectId(Long projectId);
	List<Task> findByProjectIdAndAssignedToId(Long projectId, Long userId);
	@Query("""
		SELECT t FROM Task t
			WHERE t.project.id = :projectId
			AND (:taskName IS NULL OR t.taskName LIKE %:taskName%)
			AND (:taskPriority IS NULL OR t.priority = :taskPriority)
			AND (:taskStatus IS NULL OR t.status = :taskStatus)
			AND (:startDate IS NULL OR t.startDate >= :startDate)
			AND (:dueDate IS NULL OR t.dueDate <= :dueDate)
			AND (t.assignedTo.id = :assignedToId)
	""")
	Page<Task> myTasksByProject(
			@Param("projectId") Long projectId,
			@Param("taskName") String taskName,
			@Param("taskPriority") TaskPriority taskPriority,
			@Param("taskStatus") TaskStatus taskStatus,
			@Param("startDate") LocalDate startDate,
			@Param("dueDate") LocalDate dueDate,
			@Param("assignedToId") Long assignedToId,
			Pageable pageable
	);
	@Query("""
		SELECT t FROM Task t
			WHERE (:taskName IS NULL OR t.taskName LIKE CONCAT('%', :taskName, '%'))
			AND (:taskPriority IS NULL OR t.priority = :taskPriority)
			AND (:taskStatus IS NULL OR t.status = :taskStatus)
			AND (:startDate IS NULL OR t.startDate >= :startDate)
			AND (:dueDate IS NULL OR t.dueDate <= :dueDate)
			AND ( t.project.id = :projectId )
	""")
	Page<Task> getTasksByProject(
			@Param("taskName")String taskName,
			@Param("taskPriority") TaskPriority taskPriority,
			@Param("taskStatus")TaskStatus taskStatus,
			@Param("startDate")LocalDate startDate,
			@Param("dueDate")LocalDate dueDate,
			@Param("projectId")Long projectId,
			Pageable pageable
	);
}

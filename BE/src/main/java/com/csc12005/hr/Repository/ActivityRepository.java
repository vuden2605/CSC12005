package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
	@Query("""
			SELECT a FROM Activity a
			WHERE (:activityName IS NULL OR LOWER(a.activityName) LIKE LOWER(CONCAT('%', :activityName, '%')))
			AND (:startDate IS NULL OR a.startDate >= :startDate)
			AND (:endDate IS NULL OR a.endDate <= :endDate)
		"""
	)
	Page<Activity> filterActivities(
			@Param("activityName") String activityName,
			@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate,
			Pageable pageable
	);

}

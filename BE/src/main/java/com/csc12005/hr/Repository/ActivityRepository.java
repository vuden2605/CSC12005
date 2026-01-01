package com.csc12005.hr.Repository;

import com.csc12005.hr.DTO.Response.ActivityDetailResponse;
import com.csc12005.hr.Entity.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
	@Query("""
    SELECT new com.csc12005.hr.DTO.Response.ActivityDetailResponse(
        new com.csc12005.hr.DTO.Response.ActivityResponse(
            a.id,
			a.activityName,
			a.description,
			a.activityType,
			a.startDate,
			a.endDate,
			a.startTime,
			a.endTime,
			a.duration,
			a.registrationDeadline,
			a.location,
			a.address,
			a.organizer,
			a.contactPhone,
			a.contactEmail,
			a.minParticipants,
			a.maxParticipants,
			a.registeredCount
        ),
        CAST((CASE WHEN ad.id IS NULL THEN 0 ELSE 1 END) AS boolean),
		CAST((CASE WHEN ad.isSuccess IS NULL THEN 0 ELSE ad.isSuccess END) AS boolean),
        ad.activityRank
    )
    FROM Activity a
    LEFT JOIN ActivityDetail ad ON ad.activity = a
    AND ad.employee.id = :employeeId
    WHERE (:activityName IS NULL OR LOWER(a.activityName) LIKE LOWER(CONCAT('%', :activityName, '%')))
      AND (:startDate IS NULL OR a.startDate >= :startDate)
      AND (:endDate IS NULL OR a.endDate <= :endDate)
""")
	Page<ActivityDetailResponse> getActivities(
			@Param("employeeId") Long employeeId,
			@Param("activityName") String activityName,
			@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate,
			Pageable pageable
	);

}

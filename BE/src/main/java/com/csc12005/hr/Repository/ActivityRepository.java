package com.csc12005.hr.Repository;

import com.csc12005.hr.DTO.Response.ActivityDetailResponse;
import com.csc12005.hr.Entity.Activity;
import com.csc12005.hr.Enums.ActivityStatus;
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
	        a.registeredCount,
	        a.isMandatory,
	        a.basePoints,
	        a.firstPlaceBonus,
	        a.secondPlaceBonus,
	        a.thirdPlaceBonus,
	        a.activityStatus,
	        a.isActive,
	        a.attachmentUrl,
	        a.notes,
	        a.imageUrl,
	        a.createdAt,
	        a.updatedAt,
	        cb.fullName,
	        cb.employeeCode,
	        ub.fullName,
	        ub.employeeCode
	    ),
	    (ad.id IS NOT NULL),
		(ad.isSuccess = true),
	    ad.activityRank
	)
	FROM Activity a
	LEFT JOIN a.createdBy cb
	LEFT JOIN a.updatedBy ub
	LEFT JOIN ActivityDetail ad
	    ON ad.activity = a
	    AND ad.employee.id = :employeeId
	WHERE (:activityName IS NULL OR LOWER(a.activityName) LIKE LOWER(CONCAT('%', :activityName, '%')))
	  AND (:startDate IS NULL OR a.startDate >= :startDate)
	  AND (:endDate IS NULL OR a.endDate <= :endDate)
	  AND (:activityStatus IS NULL OR a.activityStatus = :activityStatus)
	""")
	Page<ActivityDetailResponse> getActivities(
			@Param("employeeId") Long employeeId,
			@Param("activityName") String activityName,
            @Param("activityStatus") ActivityStatus activityStatus,
            @Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate,
			Pageable pageable
	);
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
	        a.registeredCount,
	        a.isMandatory,
	        a.basePoints,
	        a.firstPlaceBonus,
	        a.secondPlaceBonus,
	        a.thirdPlaceBonus,
	        a.activityStatus,
	        a.isActive,
	        a.attachmentUrl,
	        a.notes,
	        a.imageUrl,
	        a.createdAt,
	        a.updatedAt,
	        cb.fullName,
	        cb.employeeCode,
	        ub.fullName,
	        ub.employeeCode
	    ),
	    (ad.id IS NOT NULL),
		(ad.isSuccess = true),
	    ad.activityRank
	)
	FROM Activity a
	LEFT JOIN a.createdBy cb
	LEFT JOIN a.updatedBy ub
	LEFT JOIN ActivityDetail ad
	    ON ad.activity = a
	    AND ad.employee.id = :employeeId
	WHERE (:activityName IS NULL OR LOWER(a.activityName) LIKE LOWER(CONCAT('%', :activityName, '%')))
	  AND (:startDate IS NULL OR a.startDate >= :startDate)
	  AND (:endDate IS NULL OR a.endDate <= :endDate)
      AND a.activityStatus <> 'CANCELLED'
	""")
    Page<ActivityDetailResponse> getActivitiesEMP(
            @Param("employeeId") Long employeeId,
            @Param("activityName") String activityName,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
	@Query("""
        SELECT a FROM Activity a
        WHERE a.isActive = true
          AND a.activityStatus <> 'COMPLETED'
    """)
	List<Activity> findActivitiesNeedStatusUpdate();
}

package com.csc12005.hr.Repository;
import com.csc12005.hr.Entity.ActivityDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ActivityDetailRepository extends JpaRepository<ActivityDetail, Long> {
	@Query(
			"""
				SELECT ad
				FROM ActivityDetail ad
				JOIN ad.activity a
				JOIN ad.employee e
				WHERE e.id = :employeeId
				AND (:activityName IS NULL OR LOWER(a.activityName) LIKE LOWER(CONCAT('%', :activityName, '%')))
				AND (:startDate IS NULL OR a.startDate >= :startDate)
				AND (:endDate IS NULL OR a.endDate <= :endDate)
				AND (:isSuccess IS NULL or ad.isSuccess = :isSuccess)
			"""
	)
	Page<ActivityDetail> myActivities(
			@Param("employeeId") Long employeeId,
			@Param("activityName") String activityName,
			@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate,
			@Param("isSuccess") boolean isSuccess,
			Pageable pageable
	);
    @Query("""
    SELECT ad
    FROM ActivityDetail ad
    JOIN ad.employee e
    JOIN ad.activity a
    WHERE a.id = :activityId
    AND (:employeeName IS NULL
         OR LOWER(e.fullName) LIKE LOWER(CONCAT('%', :employeeName, '%')))
    AND (:isSuccess IS NULL
         OR ad.isSuccess = :isSuccess)
""")
    Page<ActivityDetail> findActivity(
            @Param("activityId") Long activityId,
            @Param("employeeName") String employeeName,
            @Param("isSuccess") Boolean isSuccess,
            Pageable pageable
    );
	boolean existsByActivity_IdAndEmployee_Id(Long activityId, Long employeeId);
	Optional<ActivityDetail> findByActivity_IdAndEmployee_EmployeeCode(Long activityId, String EmployeeCode);
    void deleteByActivity_IdAndEmployee_Id(Long activityId, Long employeeId);

}

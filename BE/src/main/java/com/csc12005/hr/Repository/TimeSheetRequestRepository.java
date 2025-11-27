package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.TimeSheetRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TimeSheetRequestRepository extends JpaRepository<TimeSheetRequest, Long> {
	@Query("SELECT tr FROM TimeSheetRequest tr " +
			"JOIN FETCH tr.employee e " +
			"WHERE tr.id = :id")
	Optional<TimeSheetRequest> findByIdWithEmployee(@Param("id") Long id);
}

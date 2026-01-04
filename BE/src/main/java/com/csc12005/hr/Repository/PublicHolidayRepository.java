package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.PublicHoliday;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicHolidayRepository extends JpaRepository<PublicHoliday, Long> {
	@Query(
	"""
			SELECT COUNT(ph)
			FROM PublicHoliday ph
			WHERE ph.year = :year AND ph.month = :month AND ph.isActive = true
	""")
	int countByYearAndMonth(int year, int month);
	@Query(
	"""
		SELECT ph
		FROM PublicHoliday ph
		WHERE (:holidayName is NULL OR LOWER(ph.holidayName) LIKE LOWER(CONCAT('%', :holidayName, '%')))
		AND (:year IS NULL OR ph.year = :year)
		AND (:month IS NULL OR ph.month = :month)
	""")
	Page<PublicHoliday> filterHolidays(
			@Param("holidayName") String holidayName,
			@Param("year") Integer year,
			@Param("month") Integer month,
			Pageable pageable
	);
}

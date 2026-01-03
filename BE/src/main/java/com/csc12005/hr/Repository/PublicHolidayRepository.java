package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.PublicHoliday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
}

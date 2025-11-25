package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.TimeSheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface TimeSheetRepository extends JpaRepository<TimeSheet, Long> {
	Optional<TimeSheet> findByEmployeeIdAndWorkDate(Long employeeId, LocalDate workDate);
}

package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.TimeSheetRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeSheetRequestRepository extends JpaRepository<TimeSheetRequest, Long> {
}

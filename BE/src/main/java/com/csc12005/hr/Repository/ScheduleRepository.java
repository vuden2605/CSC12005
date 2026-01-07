package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Schedule;
import com.csc12005.hr.Enums.ScheduleStatus;
import com.csc12005.hr.Enums.ScheduleTimeSlot;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule,Long> {
    List<Schedule> findByInterviewerAndDateAndTimeSlot(
            Employee employee,
            LocalDate date,
            ScheduleTimeSlot timeSlot
    );
    @Query("""
    SELECT DISTINCT s FROM Schedule s
    LEFT JOIN s.candidates c
    LEFT JOIN s.position p
    WHERE (:positionId IS NULL OR p.id = :positionId)
      AND (:timeSlot IS NULL OR s.timeSlot = :timeSlot)
      AND (:status IS NULL OR s.status = :status)
      AND (:location IS NULL 
           OR LOWER(s.location) LIKE LOWER(CONCAT('%', :location, '%')))
      AND (:dateFrom IS NULL OR s.date >= :dateFrom)
      AND (:dateTo IS NULL OR s.date <= :dateTo)
""")
    Page<Schedule> filterSchedules(
            @Param("positionId") Long positionId,
            @Param("timeSlot") ScheduleTimeSlot timeSlot,
            @Param("status") ScheduleStatus status,
            @Param("location") String location,
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo,
            Pageable pageable
    );
    @Query("""
    SELECT DISTINCT s FROM Schedule s
    LEFT JOIN s.candidates c
    LEFT JOIN s.position p
    LEFT JOIN p.department d
    WHERE (:departmentId IS NULL OR d.id = :departmentId)
      AND (:timeSlot IS NULL OR s.timeSlot = :timeSlot)
      AND (:status IS NULL OR s.status = :status)
      AND (:location IS NULL 
           OR LOWER(s.location) LIKE LOWER(CONCAT('%', :location, '%')))
      AND (:dateFrom IS NULL OR s.date >= :dateFrom)
      AND (:dateTo IS NULL OR s.date <= :dateTo)
""")
    Page<Schedule> filterMySchedules(
            Long departmentId,
            @Param("timeSlot") ScheduleTimeSlot timeSlot,
            @Param("status") ScheduleStatus status,
            @Param("location") String location,
            @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo,
            Pageable pageable
    );

}

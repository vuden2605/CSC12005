package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Position;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PositionRepository extends JpaRepository<Position,Long> {
    List<Position> findByDepartmentId(Long departmentId);
}

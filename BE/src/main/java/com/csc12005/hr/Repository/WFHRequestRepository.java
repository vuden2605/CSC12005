package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.WFHRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WFHRequestRepository extends JpaRepository<WFHRequest, Long> {
}

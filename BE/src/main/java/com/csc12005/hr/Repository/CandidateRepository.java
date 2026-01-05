package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Candidate;
import com.csc12005.hr.Enums.CandidateStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate,Long> {
    @Query("""
         SELECT c FROM Candidate c
    LEFT JOIN FETCH c.position
    WHERE (:fullName IS NULL OR :fullName = ''
           OR LOWER(c.fullName) LIKE LOWER(CONCAT('%', :fullName, '%')))
      AND (:email IS NULL OR :email = ''
           OR LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%')))
      AND (:positionId IS NULL
           OR c.position.id = :positionId)
      AND (:status IS NULL
           OR c.status = :status)
    """)
    List<Candidate> filterCandidates(
            @Param("fullName") String fullName,
            @Param("email") String email,
            @Param("positionId") Long positionId,
            @Param("status") CandidateStatus status,
            Pageable pageable
    );
}

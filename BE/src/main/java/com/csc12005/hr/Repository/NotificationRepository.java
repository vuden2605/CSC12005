package com.csc12005.hr.Repository;

import com.csc12005.hr.Entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
	@Query("""
    SELECT n FROM Notification n
    WHERE n.userId = :userId OR n.type = 'ACTIVITY'
""")
	Page<Notification> getNotifications(@Param("userId") Long userId, Pageable pageable);
}

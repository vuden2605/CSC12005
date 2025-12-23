package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.NotificationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long userId;

	private String title;

	private String content;

	@Enumerated(EnumType.STRING)
	private NotificationType type;

	private Long referenceId;

	@Builder.Default
	private Boolean isRead = false;

	@Builder.Default
	@CreationTimestamp
	private LocalDateTime createdAt = LocalDateTime.now();
}


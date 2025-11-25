package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Enums.RequestType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "requests")
@Inheritance(strategy = InheritanceType.JOINED)
public class Request {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Enumerated(EnumType.STRING)
	private RequestType requestType;
	@Builder.Default
	@Enumerated(EnumType.STRING)
	private RequestStatus status = RequestStatus.PENDING;
	private String requestAttachment;
	private String reason;
	@CreationTimestamp
	private LocalDateTime createdAt;
	@UpdateTimestamp
	private LocalDateTime updatedAt;
	@ManyToOne
	@JoinColumn(name = "employee_id")
	private Employee employee;
}

package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "employees")
public class Employee {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String employeeCode;
	private String fullName;
	private String gender;
	private String email;
	private String phone;
	private String emergencyContactPhone;
	private String emergencyContactName;
	private String emergencyContactRelationship;
	private LocalDate birthDate;
	private String nationalCode;
	private String taxCode;
	private String placeOfBirth;
	private String nationality;
	private String religion;
	private String bankName;
	@Builder.Default
	private Boolean status = true; // soft delete flag
	private BigDecimal baseSalary;
	@Builder.Default
	private Long totalPoints = 0L;
	@Builder.Default
	private Long allocatePoints = 0L;
	private String password;
    private String bankAccount;
    private String address;
	private String permanentAddress;

	@Enumerated(EnumType.STRING)
	private MaritalStatus maritalStatus;

	@Enumerated(EnumType.STRING)
	private EducationLevel educationLevel;

	private String major;

	private String university;

	private Integer graduationYear;

	private String degree;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "department_id")
	private Department department;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "position_id")
	private Position position;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "manager_id")
	private Employee manager;

	private LocalDate hireDate;

	private LocalDate contractStartDate;

	private LocalDate contractEndDate;

	@Enumerated(EnumType.STRING)
	private ContractType contractType;

	@Enumerated(EnumType.STRING)
	@Builder.Default
	private EmploymentStatus employmentStatus = EmploymentStatus.ACTIVE;

	private LocalDate terminationDate;

	private String terminationReason;

	@Builder.Default
	@Enumerated(EnumType.STRING)
	private WorkSchedule workSchedule = WorkSchedule.FULL_TIME;

	private String socialInsuranceNumber;

	private String healthInsuranceNumber;

	private String bankBranch;

	private String avatarUrl;

	@Builder.Default
	@Column(nullable = false)
	private Integer annualLeave = 12;

	@Builder.Default
	@Column(nullable = false)
	private Integer usedLeave = 0;

	@Column(name = "used_sick_leave_days")
	@Builder.Default
	private Integer usedSickLeaveDays = 0;

	@Column(name = "used_personal_leave_days")
	@Builder.Default
	private Integer usedPersonalLeaveDays = 0;

	@Column(name = "is_on_maternity_leave")
	@Builder.Default
	private Boolean isOnMaternityLeave = false;

	@Column(name = "maternity_start_date")
	private LocalDate maternityStartDate;

	@Column(name = "maternity_end_date")
	private LocalDate maternityEndDate;

	@Builder.Default
	@Column(nullable = false)
	private Boolean isActive = true;

	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(nullable = false)
	private LocalDateTime updatedAt;

	@ManyToOne(fetch = FetchType. LAZY)
	@JoinColumn(name = "created_by")
	private Employee createdBy;

	@ManyToOne(fetch = FetchType. LAZY)
	@JoinColumn(name = "updated_by")
	private Employee updatedBy;

	public Integer getAvailableLeave() {
		return annualLeave - usedLeave;
	}
	@Builder.Default
	private Integer numberOfDependents = 0;
}

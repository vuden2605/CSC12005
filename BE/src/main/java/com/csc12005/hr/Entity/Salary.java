package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.EducationLevel;
import com.csc12005.hr.Enums.MarialStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "salaries")
public class Salary {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private double workTime;
    private double totalPay;
    @Builder.Default
    private Boolean status=false;
    private Long month;
    private Long year;
    @ManyToOne
	@JoinColumn(name = "employee_id")
	private Employee employee;
}

package com.csc12005.hr.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "departments")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Department {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String departmentName;
	private String departmentCode;
	@OneToOne
	@JoinColumn(name = "manager_id")
	private Employee manager;
	@OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
	@Builder.Default
	private List<Position> positions = new ArrayList<>();
}

package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryResponse {
	private Long id;
	private double workTime;
    private double totalPay;
    private Boolean status;
    private Long month;
    private Long year;
    private EmployeeSalaryResponse employee;
}

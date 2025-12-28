package com.csc12005.hr.DTO.Request;

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
public class SalaryCreationRequest {
    private Long month;
    private Long year;
}

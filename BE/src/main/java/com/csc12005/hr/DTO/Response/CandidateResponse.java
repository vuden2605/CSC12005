package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Entity.Position;
import com.csc12005.hr.Entity.Schedule;
import com.csc12005.hr.Enums.CandidateStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CandidateResponse {
    private Long id;
    private String fullName;
    private String email;
    private String gender;
    private String phone;
    private String address;
    private LocalDate birthDate;
    private LocalDate createdAt;
    private String cv;

    private CandidateStatus status;
    // Đánh giá (sau phỏng vấn)
    private Integer ratingTechnical;
    private Integer ratingProblemSolving;
    private Integer ratingCommunication;
    private Integer ratingExperience;
    private Integer ratingCultureFit;
    private BigDecimal ratingAverage;
    private String feedback;
    //
    private Schedule schedule;


    private PositionResponse position;




}

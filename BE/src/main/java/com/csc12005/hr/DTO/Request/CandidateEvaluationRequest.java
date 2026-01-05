package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CandidateEvaluationRequest {
    @NotNull(message = "REQUIRED_RATING_TECHNICAL")
    private Integer ratingTechnical;

    @NotNull(message = "REQUIRED_RATING_COMMUNICATION")
    private Integer ratingCommunication;

    @NotNull(message = "REQUIRED_RATING_PROBLEM_SOLVING")
    private Integer ratingProblemSolving;

    @NotNull(message = "REQUIRED_RATING_EXPERIENCE")
    private Integer ratingExperience;

    @NotNull(message = "REQUIRED_RATING_CULTURE_FIT")
    private Integer ratingCultureFit;

    @Size(max = 1000, message = "INVALID_FEEDBACK_LENGTH")
    private String feedback;
}

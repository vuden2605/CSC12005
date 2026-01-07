package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.CandidateStatus;
import com.csc12005.hr.Enums.RequestStatus;
import com.csc12005.hr.Enums.RequestType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "candidates")
@Builder

public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;
    private String email;
    private String gender;
    private String phone;
    private String address;
    private LocalDate birthDate;
    @Builder.Default
    private LocalDate createdAt=LocalDate.now();
    private String cv;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private CandidateStatus status = CandidateStatus.NOT_INTERVIEWED;
    // Đánh giá (sau phỏng vấn)
    private Integer ratingTechnical;
    private Integer ratingProblemSolving;
    private Integer ratingCommunication;
    private Integer ratingExperience;
    private Integer ratingCultureFit;
    private BigDecimal ratingAverage;
    private String feedback;

    @ManyToOne
    @JoinColumn(name = "position_id")
    private Position position;
    @ManyToOne
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;



    public void transitionTo(CandidateStatus newStatus) {
        if (!status.canTransitionTo(newStatus)) {
            throw new IllegalStateException(
                    String.format(
                            "Không thể chuyển từ '%s' sang '%s'",
                            status.getLabel(),
                            newStatus.getLabel()
                    )
            );
        }
        this.status = newStatus;
    }

}

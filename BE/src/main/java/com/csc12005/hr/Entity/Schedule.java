package com.csc12005.hr.Entity;

import com.csc12005.hr.Enums.CandidateStatus;
import com.csc12005.hr.Enums.ScheduleStatus;
import com.csc12005.hr.Enums.ScheduleTimeSlot;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "schedules")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private ScheduleTimeSlot timeSlot;
    private String location;
    private LocalDate date;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private ScheduleStatus status=ScheduleStatus.SCHEDULED;
    @ManyToOne
    @JoinColumn(name = "interviewer_id")
    private Employee interviewer;
    @ManyToOne
    @JoinColumn(name = "position_id")
    private Position position;
    @OneToMany(mappedBy = "schedule")
    private List<Candidate> candidates;
    public void tryComplete() {
        if (candidates == null || candidates.isEmpty()) {
            return;
        }

        boolean allDone = candidates.stream()
                .allMatch(c ->
                        c.getStatus() == CandidateStatus.PASSED ||
                                c.getStatus() == CandidateStatus.FAILED
                        || c.getStatus() == CandidateStatus.INTERVIEWED
                );

        if (allDone) {
            this.status = ScheduleStatus.COMPLETED;
        }
    }
}

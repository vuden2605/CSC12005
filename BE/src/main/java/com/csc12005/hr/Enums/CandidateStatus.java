package com.csc12005.hr.Enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Set;
@AllArgsConstructor
@Getter
public enum CandidateStatus {
    NOT_INTERVIEWED("Chưa phỏng vấn"),
    INTERVIEWING("Đang phỏng vấn"),
    INTERVIEWED("Đã phỏng vấn"),
    PASSED("Đạt"),
    FAILED("Không đạt"),
    HIRED("Đã thành nhân viên");

    private final String labelVi;
    private Set<CandidateStatus> nextStatuses;

    static {
        NOT_INTERVIEWED.nextStatuses = Set.of(INTERVIEWING);

        INTERVIEWING.nextStatuses   = Set.of(INTERVIEWED,NOT_INTERVIEWED);

        INTERVIEWED.nextStatuses    = Set.of(PASSED, FAILED);

        PASSED.nextStatuses         = Set.of(HIRED);

        FAILED.nextStatuses         = Set.of();

        HIRED.nextStatuses          = Set.of();
    }

    CandidateStatus(String labelVi) {
        this.labelVi = labelVi;
    }

    public boolean canTransitionTo(CandidateStatus target) {
        return nextStatuses.contains(target);
    }

    public String getLabel() {
        return labelVi;
    }
}

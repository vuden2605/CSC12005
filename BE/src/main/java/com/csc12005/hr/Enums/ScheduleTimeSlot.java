package com.csc12005.hr.Enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ScheduleTimeSlot {
    MORNING("08:00", "11:00"),
    AFTERNOON("14:00", "17:00");

    private final String start;
    private final String end;
}

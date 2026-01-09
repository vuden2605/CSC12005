package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Entity.Candidate;
import com.csc12005.hr.Entity.Schedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleUpdatedSendMailEvent {
	private List<Candidate> candidates;
	private Schedule oldSchedule;
	private Schedule newSchedule;
}

package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Entity.Candidate;
import com.csc12005.hr.Entity.Schedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CancelScheduleEvent {
	private List<Candidate> candidates;
	private String reason;
	private Schedule schedule;
}

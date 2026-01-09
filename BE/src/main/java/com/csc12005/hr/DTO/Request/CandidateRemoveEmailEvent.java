package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Entity.Candidate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateRemoveEmailEvent {
	private Candidate candidate;
	private String reason;
}

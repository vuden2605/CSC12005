package com.csc12005.hr.DTO.Response;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class WFHResponse extends RequestResponse {
	private LocalDateTime startDate;
	private LocalDateTime endDate;
}

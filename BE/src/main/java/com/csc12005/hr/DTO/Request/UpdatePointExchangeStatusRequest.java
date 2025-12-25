package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.PointExchangeStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePointExchangeStatusRequest {
	@NotNull
	private PointExchangeStatus status;
}

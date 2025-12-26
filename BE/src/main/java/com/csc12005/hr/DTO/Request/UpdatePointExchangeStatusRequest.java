package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.PointExchangeStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePointExchangeStatusRequest {
	private List<Long> pointExchangeIds;
	@NotNull
	private PointExchangeStatus status;
}

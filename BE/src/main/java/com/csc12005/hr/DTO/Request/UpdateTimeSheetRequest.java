package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.RequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTimeSheetRequest {
	@NotNull
	private RequestStatus status;
}

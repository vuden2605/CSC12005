package com.csc12005.hr.DTO.Request;

import com.csc12005.hr.Enums.RequestType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestActionRequest {
	@NotBlank(message = "REQUIRED_REQUEST_TYPE")
	private RequestType requestType;
}


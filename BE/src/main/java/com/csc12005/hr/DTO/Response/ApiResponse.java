package com.csc12005.hr.DTO.Response;

import com.csc12005.hr.Exception.ErrorCode;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
	@Builder.Default
	private Integer code = ErrorCode.SUCCESS.getCode();
	private String message;
	private T data;
}

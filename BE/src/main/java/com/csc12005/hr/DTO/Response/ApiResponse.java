package com.csc12005.hr.DTO.Response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
	private Integer code;
	private String message;
	private T data;
}

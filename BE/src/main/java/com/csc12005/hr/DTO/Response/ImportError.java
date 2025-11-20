package com.csc12005.hr.DTO.Response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportError {
	private int code;
	private String message;
}

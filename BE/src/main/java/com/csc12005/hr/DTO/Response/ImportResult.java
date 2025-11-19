package com.csc12005.hr.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportResult {
	private boolean isSuccess;
	private int successRow;
	private int errorRow;
	private List<ImportError> importErrors;
}

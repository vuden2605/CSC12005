package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Sort;

@Data
@Builder
public class PageRequest {
	@Builder.Default
	private int page = 0;
	@Builder.Default
	private int size = 10;
	@NotNull
	private String sortBy;
	@Builder.Default
	private Sort.Direction direction = Sort.Direction.ASC;
}

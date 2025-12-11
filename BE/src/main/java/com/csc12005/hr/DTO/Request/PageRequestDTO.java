package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Data
@Builder
public class PageRequestDTO {
	@Builder.Default
	private int page = 0;
	@Builder.Default
	private int size = 10;
	@Builder.Default
	private String sortBy = "id";
	@Builder.Default
	private Sort.Direction direction = Sort.Direction.ASC;
	public Pageable buildPageable() {
		return PageRequest.of(page, size, Sort.by(direction, sortBy));
	}
}

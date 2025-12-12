package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Data
public class PageRequestDTO {
	private Integer page = 0;
	private Integer size = 10;
	private String sortBy = "id";
	private Sort.Direction direction = Sort.Direction.ASC;
	public Pageable buildPageable() {
		return PageRequest.of(
				page,
				size,
				Sort.by(
						direction,
						sortBy
				)
		);
	}
}

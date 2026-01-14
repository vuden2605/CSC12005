package com.csc12005.hr.DTO.Request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {
	@Builder.Default
	private Integer page = 0;
	@Builder.Default
	private Integer size = 10;
	@Builder.Default
	private String sortBy = "id";
	@Builder.Default
	private Sort.Direction direction = Sort.Direction.DESC;
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

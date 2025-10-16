package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.PositionCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.PositionResponse;
import com.csc12005.hr.Service.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
public class PositionController {
	private final PositionService positionService;
	@PostMapping("/positions")
	public ApiResponse<PositionResponse> createPosition(@RequestBody PositionCreationRequest positionCreationRequest) {
		return ApiResponse.<PositionResponse>builder()
				.code(201)
				.message("Position created successfully")
				.data(positionService.createPosition(positionCreationRequest))
				.build();
	}
}

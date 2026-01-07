package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.PositionCreationRequest;
import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.DTO.Response.PositionResponse;
import com.csc12005.hr.Service.PositionService.Impl.PositionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PositionController {
	private final PositionService positionService;
	@PostMapping("/positions")
	public ApiResponse<PositionResponse> createPosition(@RequestBody @Valid PositionCreationRequest positionCreationRequest) {
		return ApiResponse.<PositionResponse>builder()
				.message("Position created successfully")
				.data(positionService.createPosition(positionCreationRequest))
				.build();
	}
    @GetMapping("/positions/{id}")
    public ApiResponse<List<PositionResponse>> getPositionByDepartmentID(@PathVariable Long id){
        return ApiResponse.<List<PositionResponse>>builder()
                .message("get position by departmentid")
                .data(positionService.getPositionByDepartment(id))
                .build();
    }
    @GetMapping("/positions")
    public ApiResponse<List<PositionResponse>> getAllPositions() {
        return ApiResponse.<List<PositionResponse>>builder()
                .message("get all positions")
                .data(positionService.getAllPositions())
                .build();
    }
}

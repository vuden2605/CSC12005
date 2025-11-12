package com.csc12005.hr.Service.PositionService;

import com.csc12005.hr.DTO.Request.PositionCreationRequest;
import com.csc12005.hr.DTO.Response.PositionResponse;
import org.springframework.stereotype.Service;

@Service
public interface IPositionService {
	PositionResponse createPosition(PositionCreationRequest positionCreationRequest);
}

package com.csc12005.hr.Service.PositionService;

import com.csc12005.hr.DTO.Request.PositionCreationRequest;
import com.csc12005.hr.DTO.Response.PositionResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IPositionService {
	PositionResponse createPosition(PositionCreationRequest positionCreationRequest);
     List<PositionResponse> getPositionByDepartment(Long DepartmentID);

}

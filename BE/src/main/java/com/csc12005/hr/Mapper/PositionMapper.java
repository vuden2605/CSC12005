package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.PositionCreationRequest;
import com.csc12005.hr.DTO.Response.PositionResponse;
import com.csc12005.hr.Entity.Position;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface PositionMapper {
	Position toPosition(PositionCreationRequest positionCreationRequest);
	PositionResponse toPositionResponse(Position position);
}

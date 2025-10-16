package com.csc12005.hr.Service;

import com.csc12005.hr.DTO.Request.PositionCreationRequest;
import com.csc12005.hr.DTO.Response.PositionResponse;
import com.csc12005.hr.Entity.Position;
import com.csc12005.hr.Mapper.PositionMapper;
import com.csc12005.hr.Repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PositionService {
	private final PositionRepository positionRepository;
	private final PositionMapper positionMapper;
	public PositionResponse createPosition(PositionCreationRequest positionCreationRequest) {
		Position position = positionMapper.toPosition(positionCreationRequest);
		return positionMapper.toPositionResponse(positionRepository.save(position));
	}
}

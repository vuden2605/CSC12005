package com.csc12005.hr.Service.PositionService.Impl;

import com.csc12005.hr.DTO.Request.PositionCreationRequest;
import com.csc12005.hr.DTO.Response.PositionResponse;
import com.csc12005.hr.Entity.Position;
import com.csc12005.hr.Mapper.PositionMapper;
import com.csc12005.hr.Repository.PositionRepository;
import com.csc12005.hr.Service.PositionService.IPositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PositionService implements IPositionService {
	private final PositionRepository positionRepository;
	private final PositionMapper positionMapper;
	public PositionResponse createPosition(PositionCreationRequest positionCreationRequest) {
		Position position = positionMapper.toPosition(positionCreationRequest);
		return positionMapper.toPositionResponse(positionRepository.save(position));
	}
    public List<PositionResponse> getPositionByDepartment(Long DepartmentID){
        List<Position> list= positionRepository.findByDepartmentId(DepartmentID);
        return list.stream().map(positionMapper::toPositionResponse).toList();
    };
}

package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.PositionCreationRequest;
import com.csc12005.hr.DTO.Response.PositionResponse;
import com.csc12005.hr.Entity.Position;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-17T09:02:30+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.1 (Oracle Corporation)"
)
@Component
public class PositionMapperImpl implements PositionMapper {

    @Override
    public Position toPosition(PositionCreationRequest positionCreationRequest) {
        if ( positionCreationRequest == null ) {
            return null;
        }

        Position.PositionBuilder position = Position.builder();

        position.positionName( positionCreationRequest.getPositionName() );
        position.positionCode( positionCreationRequest.getPositionCode() );
        position.salaryRangeMin( positionCreationRequest.getSalaryRangeMin() );
        position.salaryRangeMax( positionCreationRequest.getSalaryRangeMax() );
        position.baseWorkTimes( positionCreationRequest.getBaseWorkTimes() );
        position.point( positionCreationRequest.getPoint() );

        return position.build();
    }

    @Override
    public PositionResponse toPositionResponse(Position position) {
        if ( position == null ) {
            return null;
        }

        PositionResponse.PositionResponseBuilder positionResponse = PositionResponse.builder();

        positionResponse.positionName( position.getPositionName() );
        positionResponse.positionCode( position.getPositionCode() );
        positionResponse.salaryRangeMin( position.getSalaryRangeMin() );
        positionResponse.salaryRangeMax( position.getSalaryRangeMax() );
        positionResponse.baseWorkTimes( position.getBaseWorkTimes() );
        positionResponse.point( position.getPoint() );

        return positionResponse.build();
    }
}

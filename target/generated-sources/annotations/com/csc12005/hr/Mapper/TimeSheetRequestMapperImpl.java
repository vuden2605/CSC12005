package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.TimeSheetRequestCreationRequest;
import com.csc12005.hr.DTO.Response.TimeSheetRequestResponse;
import com.csc12005.hr.Entity.TimeSheetRequest;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-15T11:19:13+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.1 (Oracle Corporation)"
)
@Component
public class TimeSheetRequestMapperImpl implements TimeSheetRequestMapper {

    @Override
    public TimeSheetRequest toTimeSheetRequest(TimeSheetRequestCreationRequest timeSheetRequestCreationRequest) {
        if ( timeSheetRequestCreationRequest == null ) {
            return null;
        }

        TimeSheetRequest.TimeSheetRequestBuilder<?, ?> timeSheetRequest = TimeSheetRequest.builder();

        timeSheetRequest.requestAttachment( timeSheetRequestCreationRequest.getRequestAttachment() );
        timeSheetRequest.reason( timeSheetRequestCreationRequest.getReason() );
        timeSheetRequest.checkInNew( timeSheetRequestCreationRequest.getCheckInNew() );
        timeSheetRequest.checkOutNew( timeSheetRequestCreationRequest.getCheckOutNew() );

        return timeSheetRequest.build();
    }

    @Override
    public TimeSheetRequestResponse toTimeSheetRequestResponse(TimeSheetRequest timeSheetRequest) {
        if ( timeSheetRequest == null ) {
            return null;
        }

        TimeSheetRequestResponse.TimeSheetRequestResponseBuilder<?, ?> timeSheetRequestResponse = TimeSheetRequestResponse.builder();

        timeSheetRequestResponse.requestId( timeSheetRequest.getRequestId() );
        if ( timeSheetRequest.getRequestType() != null ) {
            timeSheetRequestResponse.requestType( timeSheetRequest.getRequestType().name() );
        }
        timeSheetRequestResponse.status( timeSheetRequest.getStatus() );
        timeSheetRequestResponse.requestAttachment( timeSheetRequest.getRequestAttachment() );
        timeSheetRequestResponse.reason( timeSheetRequest.getReason() );
        timeSheetRequestResponse.createdAt( timeSheetRequest.getCreatedAt() );
        timeSheetRequestResponse.updatedAt( timeSheetRequest.getUpdatedAt() );
        timeSheetRequestResponse.checkInNew( timeSheetRequest.getCheckInNew() );
        timeSheetRequestResponse.checkOutNew( timeSheetRequest.getCheckOutNew() );

        return timeSheetRequestResponse.build();
    }
}

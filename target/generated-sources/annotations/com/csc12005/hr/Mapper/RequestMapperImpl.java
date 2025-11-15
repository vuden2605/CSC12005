package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.RequestCreationRequest;
import com.csc12005.hr.DTO.Response.RequestResponse;
import com.csc12005.hr.Entity.Request;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-15T11:19:13+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.1 (Oracle Corporation)"
)
@Component
public class RequestMapperImpl implements RequestMapper {

    @Override
    public Request toRequest(RequestCreationRequest requestCreationRequest) {
        if ( requestCreationRequest == null ) {
            return null;
        }

        Request.RequestBuilder<?, ?> request = Request.builder();

        request.requestAttachment( requestCreationRequest.getRequestAttachment() );
        request.reason( requestCreationRequest.getReason() );

        return request.build();
    }

    @Override
    public RequestResponse toRequestResponse(Request request) {
        if ( request == null ) {
            return null;
        }

        RequestResponse.RequestResponseBuilder<?, ?> requestResponse = RequestResponse.builder();

        requestResponse.requestId( request.getRequestId() );
        if ( request.getRequestType() != null ) {
            requestResponse.requestType( request.getRequestType().name() );
        }
        requestResponse.status( request.getStatus() );
        requestResponse.requestAttachment( request.getRequestAttachment() );
        requestResponse.reason( request.getReason() );
        requestResponse.createdAt( request.getCreatedAt() );
        requestResponse.updatedAt( request.getUpdatedAt() );

        return requestResponse.build();
    }
}

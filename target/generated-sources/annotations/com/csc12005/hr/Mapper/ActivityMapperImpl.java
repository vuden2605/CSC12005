package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.ActivityCreationRequest;
import com.csc12005.hr.DTO.Response.ActivityResponse;
import com.csc12005.hr.Entity.Activity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-01T15:38:54+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.1 (Oracle Corporation)"
)
@Component
public class ActivityMapperImpl implements ActivityMapper {

    @Override
    public Activity toActivity(ActivityCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Activity.ActivityBuilder activity = Activity.builder();

        activity.activityName( request.getActivityName() );
        activity.description( request.getDescription() );
        activity.startDate( request.getStartDate() );
        activity.endDate( request.getEndDate() );
        activity.points( request.getPoints() );

        return activity.build();
    }

    @Override
    public ActivityResponse toActivityResponse(Activity activity) {
        if ( activity == null ) {
            return null;
        }

        ActivityResponse.ActivityResponseBuilder activityResponse = ActivityResponse.builder();

        activityResponse.id( activity.getId() );
        activityResponse.activityName( activity.getActivityName() );
        activityResponse.description( activity.getDescription() );
        activityResponse.startDate( activity.getStartDate() );
        activityResponse.endDate( activity.getEndDate() );
        activityResponse.points( activity.getPoints() );

        return activityResponse.build();
    }
}

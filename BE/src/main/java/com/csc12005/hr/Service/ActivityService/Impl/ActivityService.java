package com.csc12005.hr.Service.ActivityService.Impl;

import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.DTO.Response.ActivityDetailHRResponse;
import com.csc12005.hr.DTO.Response.ActivityDetailResponse;
import com.csc12005.hr.DTO.Response.ActivityResponse;
import com.csc12005.hr.Entity.Activity;
import com.csc12005.hr.Entity.ActivityDetail;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.ActivityMapper;
import com.csc12005.hr.Repository.ActivityDetailRepository;
import com.csc12005.hr.Repository.ActivityRepository;
import com.csc12005.hr.Service.ActivityService.IActivityService;
import com.csc12005.hr.Service.S3Service.Impl.S3Service;
import com.csc12005.hr.Utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ActivityService implements IActivityService {
	private final ActivityRepository activityRepository;
	private final ActivityMapper activityMapper;
    private final ActivityDetailRepository activityDetailRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final SecurityUtils securityUtils;
    private final S3Service s3Service;
    @Transactional
	@Override
	public ActivityResponse createActivity(ActivityCreationRequest activityCreationRequest) {
        LocalDate startDate = activityCreationRequest.getStartDate();
        LocalDate sevenDaysAgo = startDate.minusDays(7);

        if (!LocalDate.now().isBefore(sevenDaysAgo)) {
            throw new AppException(ErrorCode.START_DATE_TOO_RECENT);
        }
	    Activity activity = activityMapper.toActivity(activityCreationRequest);
        if (activityCreationRequest.getAttachment() != null) {
	        String attachmentUrl = s3Service.uploadFile(activityCreationRequest.getAttachment());
	        activity.setAttachmentUrl(attachmentUrl);
        }
        String imageUrl = s3Service.uploadFile(activityCreationRequest.getImage());
		activity.setImageUrl(imageUrl);
		eventPublisher.publishEvent(ActivityCreated.builder()
			.activityId(activity.getId())
			.activityName(activity.getActivityName())
			.build());
		return activityMapper.toActivityResponse(activityRepository.save(activity));
	}

	@Override
	public Page<ActivityDetailResponse> getActivities(ActivityFilterRequest activityFilterRequest, PageRequestDTO pageRequestDTO) {
		Long employeeId = securityUtils.getCurrentUserId();
		return activityRepository.getActivities(
				employeeId,
				activityFilterRequest.getActivityName(),
				activityFilterRequest.getStartDate(),
				activityFilterRequest.getEndDate(),
				pageRequestDTO.buildPageable()
		);

	}
    @Override
    public ActivityResponse updateActivity(ActivityUpdateRequest request, long id)
    {
        Activity activity= activityRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.ACTIVITY_NOT_FOUND));
        LocalDate startDate = activity.getStartDate();
        LocalDate sevenDaysAgo = startDate.minusDays(7);

        if (!LocalDate.now().isBefore(sevenDaysAgo)) {
            throw new AppException(ErrorCode.UPDATE_TOO_LATE);
        }
        activityMapper.updateActivity(activity, request);
        return activityMapper.toActivityResponse(activityRepository.save(activity));
    }
    @Override
    public Page<ActivityDetailHRResponse> getActivityParticipants(
            Long activityId,
            String employeeName,
            Boolean isSuccess,
            PageRequestDTO pageRequestDTO
    ) {

        activityRepository.findById(activityId)
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));

        return activityDetailRepository
                .findActivity(
                        activityId,
                        employeeName,
                        isSuccess,
                        pageRequestDTO.buildPageable()
                )
                .map(this::toActivityDetailHRResponse);
    }
    private ActivityDetailHRResponse toActivityDetailHRResponse(ActivityDetail ad) {
        return ActivityDetailHRResponse.builder()
                .id(ad.getId())
                .employeeId(ad.getEmployee().getId())
                .employeeName(ad.getEmployee().getFullName())
                .activityRank(ad.getActivityRank())
                .isSuccess(ad.getIsSuccess())
                .build();
    }

}

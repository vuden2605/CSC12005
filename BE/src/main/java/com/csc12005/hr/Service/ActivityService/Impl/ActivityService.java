package com.csc12005.hr.Service.ActivityService.Impl;

import com.csc12005.hr.DTO.Request.*;
import com.csc12005.hr.DTO.Response.ActivityDetailHRResponse;
import com.csc12005.hr.DTO.Response.ActivityDetailResponse;
import com.csc12005.hr.DTO.Response.ActivityResponse;
import com.csc12005.hr.Entity.Activity;
import com.csc12005.hr.Entity.ActivityDetail;
import com.csc12005.hr.Enums.ActivityStatus;
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
import java.time.LocalDateTime;

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
                activityFilterRequest.getActivityStatus(),
                activityFilterRequest.getStartDate(),
				activityFilterRequest.getEndDate(),
				pageRequestDTO.buildPageable()
		);

	}
    @Override
    public ActivityResponse updateActivity(ActivityUpdateRequest request, long id)
    {
//
        // Tìm activity
        Activity activity = activityRepository. findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));

        // ========== Update basic fields ==========
        activity.setActivityName(request.getActivityName());
        activity.setDescription(request. getDescription());
        activity.setActivityType(request.getActivityType());

        // Thời gian
        activity.setStartDate(request.getStartDate());
        activity.setEndDate(request.getEndDate());
        activity.setStartTime(request. getStartTime());
        activity.setEndTime(request.getEndTime());
        activity.setDuration(request.getDuration());
        activity.setRegistrationDeadline(request.getRegistrationDeadline());

        // Địa điểm
        activity.setLocation(request.getLocation());
        activity.setAddress(request.getAddress());

        // Liên hệ
        activity. setOrganizer(request.getOrganizer());
        activity.setContactPhone(request.getContactPhone());
        activity.setContactEmail(request.getContactEmail());

        // Số lượng
        activity.setMinParticipants(request.getMinParticipants());
        activity.setMaxParticipants(request. getMaxParticipants());
        activity.setIsMandatory(request.getIsMandatory());

        // Điểm
        activity.setBasePoints(request.getBasePoints());
        activity.setFirstPlaceBonus(request.getFirstPlaceBonus());
        activity.setSecondPlaceBonus(request.getSecondPlaceBonus());
        activity.setThirdPlaceBonus(request.getThirdPlaceBonus());

        // Ghi chú
        activity.setNotes(request.getNotes());

        // ========== Update IMAGE if new file uploaded ==========
        String urlImg= request.getImage() != null ? s3Service.uploadFile(request.getImage()) : activity.getImageUrl();
        activity.setImageUrl(urlImg);

        String urlAttachment = request.getAttachment() != null ? s3Service.uploadFile(request.getAttachment()) : activity.getAttachmentUrl();
        activity.setAttachmentUrl(urlAttachment);

        // Save
        Activity updated = activityRepository. save(activity);
        return activityMapper.toActivityResponse(updated);
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
    @Override
    @Transactional
    public ActivityResponse openRegistration(Long activityId) {

        // Tìm activity
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));

        // Kiểm tra trạng thái hiện tại
        if (activity.getActivityStatus() != ActivityStatus.DRAFT) {
            throw new AppException(ErrorCode.ACTIVITY_NOT_DRAFT);
        }

        // Cập nhật trạng thái
        activity.setActivityStatus(ActivityStatus.OPEN_FOR_REGISTRATION);
        activity.setUpdatedAt(LocalDateTime.now());

        Activity savedActivity = activityRepository.save(activity);
        return activityMapper.toActivityResponse(savedActivity);
    }
    @Override
    @Transactional
    public ActivityResponse cancelDraftActivity(Long activityId) {

        // Tìm activity
        Activity activity = activityRepository. findById(activityId)
                .orElseThrow(() -> new AppException(ErrorCode. ACTIVITY_NOT_FOUND));

        // Kiểm tra trạng thái hiện tại
        if (activity.getActivityStatus() != ActivityStatus.DRAFT) {
            throw new AppException(ErrorCode.ACTIVITY_NOT_DRAFT);
        }

        // Cập nhật trạng thái
        activity.setActivityStatus(ActivityStatus.CANCELLED);
        activity.setUpdatedAt(LocalDateTime.now());

        Activity savedActivity = activityRepository.save(activity);


        return activityMapper.toActivityResponse(savedActivity);
    }
    @Override
    public Page<ActivityDetailResponse> getActivitiesEMP(ActivityFilterRequest activityFilterRequest, PageRequestDTO pageRequestDTO)
    {
        Long employeeId = securityUtils.getCurrentUserId();
        return activityRepository.getActivitiesEMP(
                employeeId,
                activityFilterRequest.getActivityName(),
                activityFilterRequest.getStartDate(),
                activityFilterRequest.getEndDate(),
                pageRequestDTO.buildPageable()
        );
    }



}

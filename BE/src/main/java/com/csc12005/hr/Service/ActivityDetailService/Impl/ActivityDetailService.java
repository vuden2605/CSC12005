package com.csc12005.hr.Service.ActivityDetailService.Impl;

import com.csc12005.hr.DTO.Response.ImportError;
import com.csc12005.hr.DTO.Response.ImportResult;
import com.csc12005.hr.Entity.Activity;
import com.csc12005.hr.Entity.ActivityDetail;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.PointHistory;
import com.csc12005.hr.Enums.PointReasonType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Repository.ActivityDetailRepository;
import com.csc12005.hr.Repository.ActivityRepository;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.PointHistoryRepository;
import com.csc12005.hr.Service.ActivityDetailService.IActivityDetailService;
import com.csc12005.hr.Utils.ExcelUtils;
import com.csc12005.hr.Utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityDetailService implements IActivityDetailService {

	private final ActivityDetailRepository activityDetailRepository;
	private final ActivityRepository activityRepository;
	private final EmployeeRepository employeeRepository;
	private final PointHistoryRepository pointHistoryRepository;
	private final SecurityUtils securityUtils;
	@Transactional
	@Override
	public void createActivityDetail(Long activityId) {
		Activity activity = activityRepository.findById(activityId)
				.orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));
        if(!activity.canRegister()) {
			throw new AppException(ErrorCode.CANNOT_REGISTER_ACTIVITY);
		}
		Long employeeId = securityUtils.getCurrentUserId();
		if (activityDetailRepository.existsByActivity_IdAndEmployee_Id(activityId, employeeId)) {
			throw new AppException(ErrorCode.ALREADY_REGISTERED_ACTIVITY);
		}
		ActivityDetail activityDetail = ActivityDetail.builder()
				.activity(activity)
				.employee(employeeRepository.getReferenceById(employeeId))
				.build();
		activityDetailRepository.save(activityDetail);
		activity.setRegisteredCount((activity.getRegisteredCount() + 1));
		activityRepository.save(activity);
	}
    @Transactional
    @Override
    public void deleteActivityDetail(Long activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));
        if(!activity.canCancel()) {
	        throw new AppException(ErrorCode.CANNOT_CANCEL_ACTIVITY);
        }
        Long employeeId = securityUtils.getCurrentUserId();
        activityDetailRepository.deleteByActivity_IdAndEmployee_Id(activityId,employeeId);
        activity.setRegisteredCount((activity.getRegisteredCount() - 1));
        activityRepository.save(activity);
    }
    @Transactional
	public ImportResult importActivityResult (MultipartFile file) {
		int successCount = 0;
		List<ImportError> importErrors = new ArrayList<>();
		List<ActivityDetail> activityDetails = new ArrayList<>();
		List<PointHistory> pointHistories = new ArrayList<>();
		List<Employee> employeesToUpdate = new ArrayList<>();
		try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
			Sheet sheet = workbook.getSheetAt(0);
			for (int i = 1; i <= sheet.getLastRowNum(); i++) {
				Row row = sheet.getRow(i);
				if (row == null) continue;
				try {
					Long activityId = ExcelUtils.getLong(row.getCell(0));
					if (activityId == null) continue;
					String employeeCode = ExcelUtils.getString(row.getCell(1));
					String booleanString = ExcelUtils.getString(row.getCell(2));
					if(!booleanString.equalsIgnoreCase("true") && !booleanString.equalsIgnoreCase("false")) {
						throw new AppException(ErrorCode.IMPORT_INVALID_BOOLEAN_FORMAT);
					}
					Boolean isSuccess = Boolean.parseBoolean(booleanString);
					Long activityRank = ExcelUtils.getLong(row.getCell(3));
					if (activityRank == null) {
						activityRank = 0L;
					}
					ActivityDetail activityDetail = activityDetailRepository.findByActivity_IdAndEmployee_EmployeeCode(activityId, employeeCode)
							.orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_DETAIL_NOT_FOUND));
					if(activityDetail.getIsSuccess() != null) {
						throw new AppException(ErrorCode.ACTIVITY_RESULT_ALREADY_EXISTS);
					}
					activityDetail.setActivityRank(activityRank);
					activityDetail.setIsSuccess(isSuccess);
					activityDetails.add(activityDetail);
					successCount++;
					if (isSuccess) {
						Long points = calculateTotalPoints(activityDetail);
						Employee employee = activityDetail.getEmployee();
						employee.setTotalPoints(employee.getTotalPoints() + points);
						PointHistory pointHistory = buildPointHistory(activityDetail, points);
						employeesToUpdate.add(employee);
						pointHistories.add(pointHistory);
					}

				}
				catch (Exception ex) {
					importErrors.add(
							ImportError.builder()
									.code(ErrorCode.IMPORT_EMPLOYEE_FAIL.getCode())
									.message("Dòng " + (i + 1) + ": " + ex.getMessage())
									.build()
					);
				}
			}
		}
		catch (Exception e) {
			throw new AppException(ErrorCode.FILE_INVALID_FORMAT);
		}
		if (!activityDetails.isEmpty()) {
			activityDetailRepository.saveAll(activityDetails);
		}
		if(!pointHistories.isEmpty()) {
			pointHistoryRepository.saveAll(pointHistories);
		}
	    if (! employeesToUpdate.isEmpty()) {
		    employeeRepository.saveAll(employeesToUpdate);
	    }

	    return ImportResult.builder()
				.successRow(successCount)
				.importErrors(importErrors)
				.isSuccess(true)
				.build();
	}
	private Long calculateTotalPoints(ActivityDetail activityDetail) {

		Activity activity = activityDetail.getActivity();
		Long basePoints = activity.getBasePoints();
		Long rank = activityDetail.getActivityRank();
		Long bonusPoints = 0L;

		if (activityDetail.getIsSuccess() != null && activityDetail.getIsSuccess()) {
			if (rank == 1L && activity.getFirstPlaceBonus() != null) {
				bonusPoints = activity.getFirstPlaceBonus();
			} else if (rank == 2L && activity. getSecondPlaceBonus() != null) {
				bonusPoints = activity.getSecondPlaceBonus();
			} else if (rank == 3L && activity.getThirdPlaceBonus() != null) {
				bonusPoints = activity.getThirdPlaceBonus();
			}
		}
		return basePoints + bonusPoints;
	}
	private PointHistory buildPointHistory(ActivityDetail activityDetail, Long points) {
		return PointHistory.builder()
				.employee(activityDetail.getEmployee())
				.pointChange(points)
				.referenceId(activityDetail.getId())
				.description("Tham gia hoạt động: " + activityDetail.getActivity().getActivityName())
				.reasonType(PointReasonType.ACTIVITY_BONUS)
				.build();
	}
}

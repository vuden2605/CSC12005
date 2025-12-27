package com.csc12005.hr.Service.ActivityDetailService.Impl;

import com.csc12005.hr.DTO.Request.ActivityDetailFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.ActivityDetailResponse;
import com.csc12005.hr.DTO.Response.ImportError;
import com.csc12005.hr.DTO.Response.ImportResult;
import com.csc12005.hr.Entity.Activity;
import com.csc12005.hr.Entity.ActivityDetail;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.ActivityDetailMapper;
import com.csc12005.hr.Repository.ActivityDetailRepository;
import com.csc12005.hr.Repository.ActivityRepository;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Service.ActivityDetailService.IActivityDetailService;
import com.csc12005.hr.Service.ActivityService.IActivityService;
import com.csc12005.hr.Utils.ExcelUtils;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityDetailService implements IActivityDetailService {

	private final ActivityDetailRepository activityDetailRepository;
	private final ActivityRepository activityRepository;
	private final EmployeeRepository employeeRepository;
	@Transactional
	@Override
	public void createActivityDetail(Long activityId) {
		Activity activity = activityRepository.findById(activityId)
				.orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));
        LocalDate startDate = activity.getStartDate();
        LocalDate threeDaysAgo = startDate.minusDays(3);

        if (!LocalDate.now().isBefore(threeDaysAgo)) {
            throw new AppException(ErrorCode.REGISTRATION_TOO_LATE);
        }
        if (activity.getRegisteredCount() >= activity.getCount()) {
            throw new AppException(ErrorCode.ACTIVITY_FULL);
        }
		var context = SecurityContextHolder.getContext();
		long employeeId = Long.parseLong(context.getAuthentication().getName());
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		ActivityDetail activityDetail = ActivityDetail.builder()
				.activity(activity)
				.employee(employee)
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
        LocalDate startDate = activity.getStartDate();
        LocalDate threeDaysAgo = startDate.minusDays(3);

        if (!LocalDate.now().isBefore(threeDaysAgo)) {
            throw new AppException(ErrorCode.CANCELLATION_TOO_LATE);
        }

        var context = SecurityContextHolder.getContext();
        long employeeId = Long.parseLong(context.getAuthentication().getName());
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
        activityDetailRepository.deleteByActivity_IdAndEmployee_Id(activityId,employeeId);
        activity.setRegisteredCount((activity.getRegisteredCount() - 1));
        activityRepository.save(activity);
    }
	public ImportResult importActivityResult (MultipartFile file) {
		int successCount = 0;
		List<ImportError> importErrors = new ArrayList<>();
		List<ActivityDetail> activityDetails = new ArrayList<>();
		try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
			Sheet sheet = workbook.getSheetAt(0);
			for (int i = 1; i <= sheet.getLastRowNum(); i++) {
				Row row = sheet.getRow(i);
				if (row == null) continue;
				try {
					Long activityId = ExcelUtils.getLong(row.getCell(0));
					String employeeCode = ExcelUtils.getString(row.getCell(1));
					Boolean isSuccess = Boolean.valueOf(ExcelUtils.getString(row.getCell(2)));
					Long activityRank = ExcelUtils.getLong(row.getCell(3));
					if (activityRank == null) {
						activityRank = 0L;
					}

					if (activityId == null) continue;


					ActivityDetail activityDetail = activityDetailRepository.findByActivity_IdAndEmployee_EmployeeCode(activityId, employeeCode)
							.orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_DETAIL_NOT_FOUND));

					activityDetail.setActivityRank(activityRank);
					activityDetail.setIsSuccess(isSuccess);
					activityDetails.add(activityDetail);
					successCount++;

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
		return ImportResult.builder()
				.successRow(successCount)
				.importErrors(importErrors)
				.isSuccess(true)
				.build();
	}
}

package com.csc12005.hr.Service.PublicHolidayService.Impl;

import com.csc12005.hr.DTO.Request.HolidayFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.PublicHolidayCreationRequest;
import com.csc12005.hr.DTO.Response.ImportError;
import com.csc12005.hr.DTO.Response.ImportResult;
import com.csc12005.hr.DTO.Response.PublicHolidayResponse;
import com.csc12005.hr.Entity.PublicHoliday;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.PublicHolidayMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.PublicHolidayRepository;
import com.csc12005.hr.Service.PublicHolidayService.IPublicHolidayService;
import com.csc12005.hr.Utils.ExcelUtils;
import com.csc12005.hr.Utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HolidayService implements IPublicHolidayService {
	private final PublicHolidayRepository publicHolidayRepository;
	private final PublicHolidayMapper publicHolidayMapper;
	private final SecurityUtils securityUtils;
	private final EmployeeRepository employeeRepository;
	@Override
	public PublicHolidayResponse createPublicHoliday(PublicHolidayCreationRequest request) {
		PublicHoliday holiday = publicHolidayMapper.toEntity(request);
		PublicHoliday savedHoliday = publicHolidayRepository.save(holiday);
		return publicHolidayMapper.toResponse(savedHoliday);
	}

	@Override
	public PublicHolidayResponse getPublicHolidayById(Long id) {
		PublicHoliday holiday = publicHolidayRepository.findById(id)
				.orElseThrow(() -> new AppException(ErrorCode.HOLIDAY_NOT_FOUND));
		return publicHolidayMapper.toResponse(holiday);
	}
	@Override
	public Page<PublicHolidayResponse> filterHolidays(HolidayFilterRequest filterRequest, PageRequestDTO pageRequest) {
		Pageable pageable = pageRequest.buildPageable();
		Page<PublicHoliday> holidays = publicHolidayRepository.filterHolidays(
				filterRequest.getHolidayName(),
				filterRequest.getYear(),
				filterRequest.getMonth(),
				pageable
		);
		return holidays.map(publicHolidayMapper::toResponse);
	}
	@Transactional
	@Override
	public ImportResult importHolidays(MultipartFile file) {
		Long currentUserId = securityUtils.getCurrentUserId();
		int successCount = 0;
		List<ImportError> errors = new ArrayList<>();
		List<PublicHoliday> holidays = new ArrayList<>();
		try(Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
			Sheet sheet = workbook.getSheetAt(0);
			for(int i = 1; i <= sheet.getLastRowNum(); i++) {
				try {
					Row row = sheet.getRow(i);
					PublicHoliday holiday = PublicHoliday.builder()
							.holidayName(ExcelUtils.getString(row.getCell(0)))
							.holidayDate(ExcelUtils.getLocalDate(row.getCell(1)))
							.year(Integer.valueOf(ExcelUtils.getString(row.getCell(2))))
							.month(Integer.valueOf(ExcelUtils.getString(row.getCell(3))))
							.description(ExcelUtils.getString(row.getCell(4)))
							.createdBy(employeeRepository.getReferenceById(currentUserId))
							.updatedBy(employeeRepository.getReferenceById(currentUserId))
							.build();
					holidays.add(holiday);
					successCount++;
				}
				catch (Exception ex) {
					errors.add(
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
		if (!holidays.isEmpty())  {
			publicHolidayRepository.saveAll(holidays);
		}
		return ImportResult.builder()
				.successRow(successCount)
				.importErrors(errors)
				.build();

	}
}

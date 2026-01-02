package com.csc12005.hr.Service.TimeSheetService.Impl;

import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.TimeSheetCreationRequest;
import com.csc12005.hr.DTO.Response.ImportError;
import com.csc12005.hr.DTO.Response.ImportResult;
import com.csc12005.hr.DTO.Response.TimeSheetResponse;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.TimeSheet;
import com.csc12005.hr.Enums.TimeSheetType;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.TimeSheetMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.TimeSheetRepository;
import com.csc12005.hr.Service.TimeSheetService.ITimeSheetService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TimeSheetService implements ITimeSheetService {
	private final TimeSheetRepository timeSheetRepository;
	private final TimeSheetMapper timeSheetMapper;
	private final EmployeeRepository employeeRepository;
	private static final int COL_EMPLOYEE_ID = 0;
	private static final int COL_WORK_DATE = 1;
	private static final int COL_CHECK_IN = 2;
	private static final int COL_CHECK_OUT = 3;

	@Transactional
	public ImportResult importTimeSheetExcel(TimeSheetCreationRequest timeSheetCreationRequest) {
		MultipartFile file = timeSheetCreationRequest.getMultipartFile();
		List<TimeSheet> timeSheets = new ArrayList<>();
		List<ImportError> importErrors = new ArrayList<>();

		try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
			Sheet sheet = workbook.getSheetAt(0);
			for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
				Row row = sheet.getRow(rowNum);
				if (row == null) continue;

				try {
					TimeSheet timeSheet = parseTimeSheetRow(row);
					timeSheet.calculateAll();
					timeSheets.add(timeSheet);
				} catch (Exception ex) {
					importErrors.add(buildImportError(rowNum, ex));
				}
			}
		}
		catch(Exception ex) {
			log.info("Error import timesheet: {}", ex.getMessage());
			throw new AppException(ErrorCode.FILE_INVALID_FORMAT);
		}
		if (importErrors.isEmpty()) {
			timeSheetRepository.saveAll(timeSheets);
		}
		return buildImportResult(timeSheets.size(), importErrors);
	}

	private TimeSheet parseTimeSheetRow(Row row) {
		Employee employee = parseEmployee(row);
		LocalDate workDate = parseLocalDate(row.getCell(COL_WORK_DATE));
		LocalTime checkIn = parseLocalTime(row.getCell(COL_CHECK_IN));
		LocalTime checkOut = parseLocalTime(row.getCell(COL_CHECK_OUT));
		validateCheckInCheckOut(checkIn, checkOut);
		return TimeSheet.builder()
				.employee(employee)
				.workDate(workDate)
				.checkIn(checkIn)
				.checkOut(checkOut)
				.build();
	}
	private void validateCheckInCheckOut(LocalTime checkIn, LocalTime checkOut) {

		if (checkIn == null || checkOut == null) {
			throw new AppException(ErrorCode.CHECK_TIME_REQUIRED);
		}
		if (checkIn.isAfter(checkOut)) {
			throw new AppException(ErrorCode.CHECK_IN_MUST_BE_BEFORE_CHECK_OUT);
		}
		Duration duration = Duration.between(checkIn, checkOut);
		if (duration.toHours() > 12) {
			throw new AppException(ErrorCode.WORK_DURATION_TOO_LONG);
		}
	}
	private Employee parseEmployee(Row row) {
		Cell cell = row.getCell(COL_EMPLOYEE_ID);
		if (cell == null || cell.getCellType() != CellType.NUMERIC) {
			throw new IllegalArgumentException("Employee ID phải là số");
		}

		long employeeId = (long) cell.getNumericCellValue();
		return employeeRepository.findById(employeeId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
	}

	private LocalDate parseLocalDate(Cell cell) {
		if (cell == null) {
			throw new IllegalArgumentException("Ngày làm việc không được để trống");
		}
		try {
			if (cell.getCellType() == CellType.NUMERIC) {
				return cell.getLocalDateTimeCellValue().toLocalDate();
			} else {
				return LocalDate.parse(cell.getStringCellValue().trim());
			}
		} catch (Exception e) {
			throw new IllegalArgumentException("Định dạng ngày không hợp lệ: " + getCellValue(cell));
		}
	}

	private LocalTime parseLocalTime(Cell cell) {
		if (cell == null) {
			throw new IllegalArgumentException("Thời gian không được để trống");
		}
		try {
			if (cell.getCellType() == CellType.NUMERIC) {
				return cell.getLocalDateTimeCellValue().toLocalTime();
			} else {
				return LocalTime.parse(cell.getStringCellValue().trim());
			}
		} catch (Exception e) {
			throw new IllegalArgumentException("Định dạng giờ không hợp lệ: " + getCellValue(cell));
		}
	}

	private TimeSheetType parseStatus(Cell cell) {
		if (cell == null) {
			throw new IllegalArgumentException("Trạng thái không được để trống");
		}
		try {
			String statusText = cell.getStringCellValue().trim().toUpperCase();
			log.info("Parsing status: {}", statusText);
			return TimeSheetType.valueOf(statusText);
		} catch (IllegalArgumentException e) {
			throw new IllegalArgumentException("Trạng thái không hợp lệ: " + getCellValue(cell));
		}
	}

	private String getCellValue(Cell cell) {
		if (cell == null) return "null";
		return switch (cell.getCellType()) {
			case STRING -> cell.getStringCellValue();
			case NUMERIC -> String.valueOf(cell.getNumericCellValue());
			case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
			default -> cell.toString();
		};
	}

	private ImportError buildImportError(int rowNum, Exception ex) {
		return ImportError.builder()
				.code(ErrorCode.IMPORT_TIMESHEET_FAIL.getCode())
				.message(String.format("Lỗi tại dòng %d: %s", rowNum, ex.getMessage()))
				.build();
	}

	private ImportResult buildImportResult(int successCount, List<ImportError> errors) {
		return ImportResult.builder()
				.successRow(successCount)
				.errorRow(errors.size())
				.importErrors(errors)
				.isSuccess(errors.isEmpty())
				.build();
	}

	public List<TimeSheetResponse> getAllTimeSheets() {
		List<TimeSheet> timeSheets = timeSheetRepository.findAll();
		return timeSheets.stream().map(timeSheetMapper::toTimeSheetResponse).toList();
	}
	public Page<TimeSheetResponse> myTimeSheets(PageRequestDTO pageRequestDTO, LocalDate fromDate, LocalDate toDate) {
		long employeeId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
		Pageable pageable = pageRequestDTO.buildPageable();
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		Page<TimeSheet> timeSheets = timeSheetRepository.myTimeSheets(employeeId, pageable, fromDate, toDate);
		return timeSheets.map(timeSheetMapper::toTimeSheetResponse);
	}

}

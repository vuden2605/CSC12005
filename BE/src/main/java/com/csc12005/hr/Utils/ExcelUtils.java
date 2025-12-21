package com.csc12005.hr.Utils;

import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import org.apache.poi.ss.formula.functions.T;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;

import java.time.LocalDate;

public class ExcelUtils {
	private static final DataFormatter FORMATTER = new DataFormatter();

	public static String getString(Cell cell) {
		if (cell == null) return null;
		String value = FORMATTER.formatCellValue(cell);
		return value != null ? value.trim() : null;
	}

	public static Long getLong(Cell cell) {
		String value = getString(cell);
		if (value == null || value.isEmpty()) return null;
		try {
			return Long.parseLong(value.replace(",", ""));
		} catch (NumberFormatException e) {
			throw new AppException(ErrorCode.INVALID_NUMBER_FORMAT);
		}
	}

	public static LocalDate getLocalDate(Cell cell) {
		if (cell == null) return null;

		try {
			if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
				return cell.getLocalDateTimeCellValue().toLocalDate();
			}

			String value = getString(cell);
			if (value == null || value.isEmpty()) return null;

			return LocalDate.parse(value);
		} catch (Exception e) {
			throw new AppException(ErrorCode.INVALID_DATE_FORMAT);
		}
	}
}

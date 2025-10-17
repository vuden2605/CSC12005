package com.csc12005.hr.Exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
	//Success
	SUCCESS(9999, "Success", HttpStatus.OK),
	//Employee
	EMPLOYEE_NOT_FOUND(1001, "Employee not found", HttpStatus.NOT_FOUND),
	EMAIL_ALREADY_EXISTS(1002, "Email already exists", HttpStatus.BAD_REQUEST),
	//Department
	DEPARTMENT_NOT_FOUND(2001, "Department not found", HttpStatus.NOT_FOUND),
	DEPARTMENT_CODE_ALREADY_EXISTS(2002, "Department code already exists", HttpStatus.BAD_REQUEST),
	//Position
	POSITION_NOT_FOUND(3001, "Position not found", HttpStatus.NOT_FOUND),
	//Validation
	VALIDATION_FAILED(4001, "Validation failed", HttpStatus.BAD_REQUEST),
	REQUIRED_FULL_NAME(4002, "Full name is required", HttpStatus.BAD_REQUEST);
	private final Integer code;
	private final String message;
	private final HttpStatus httpStatus;
}

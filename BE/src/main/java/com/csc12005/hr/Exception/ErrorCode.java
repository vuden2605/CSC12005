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
	REQUIRED_FULL_NAME(4002, "Full name is required", HttpStatus.BAD_REQUEST),
    REQUIRED_EMAIL(4003, "Email is required", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(4004, "Invalid email format", HttpStatus.BAD_REQUEST),
    INVALID_PHONE(4005, "Invalid phone number format", HttpStatus.BAD_REQUEST),
    REQUIRED_ADDRESS(4006, "Address is required", HttpStatus.BAD_REQUEST),
	REQUIRED_TIMESHEET_ID(4007, "Timesheet ID is required", HttpStatus.BAD_REQUEST),
	REQUIRED_REQUEST_ATTACHMENT(4008, "Request attachment is required", HttpStatus.BAD_REQUEST),
	REQUIRED_REASON(4009, "Reason is required", HttpStatus.BAD_REQUEST),
	REQUIRED_CHECK_IN_NEW(4010, "New check-in time is required", HttpStatus.BAD_REQUEST),
	REQUIRED_CHECK_OUT_NEW(4011, "New check-out time is required", HttpStatus.BAD_REQUEST),
	CHECK_IN_MUST_BE_BEFORE_CHECK_OUT(4012, "Check-in time must be before check-out time", HttpStatus.BAD_REQUEST),

    //Authentication
	AUTHENTICATION_FAILED(5001, "Authentication failed", HttpStatus.UNAUTHORIZED),
	USERNAME_NOT_FOUND(5002, "Username not found", HttpStatus.NOT_FOUND),
	INVALID_PASSWORD(5003, "Invalid password", HttpStatus.UNAUTHORIZED),
	UNAUTHENTICATED(5004, "Unauthenticated", HttpStatus.UNAUTHORIZED),
	FORBIDDEN(5005, "Unauthorized", HttpStatus.FORBIDDEN),
	//Timesheet
	TIMESHEET_NOT_FOUND(4013, "Timesheet not found", HttpStatus.NOT_FOUND);

	private final Integer code;
	private final String message;
	private final HttpStatus httpStatus;
}

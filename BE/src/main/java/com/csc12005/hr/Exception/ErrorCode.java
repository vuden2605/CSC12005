package com.csc12005.hr.Exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
	//Success
	SUCCESS(9999, "Success", HttpStatus.OK),
	INTERNAL_SERVER_ERROR(500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
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
	REQUIRED_WORK_DATE(4014, "Work date is required", HttpStatus.BAD_REQUEST),
	REQUIRED_START_DATE(4015, "Start date is required", HttpStatus.BAD_REQUEST),
	REQUIRED_END_DATE(4016, "End date is required", HttpStatus.BAD_REQUEST),
	REQUIRED_ACTIVITY_NAME(4017, "Activity name is required", HttpStatus.BAD_REQUEST),
	REQUIRED_ACTIVITY_TYPE(4018, "Activity type is required", HttpStatus.BAD_REQUEST),
	REQUIRED_REGISTRATION_DEADLINE(4019, "Registration deadline is required", HttpStatus.BAD_REQUEST),
	REQUIRED_MAX_PARTICIPANTS(4020, "Maximum number of participants is required", HttpStatus.BAD_REQUEST),
	REQUIRED_LOCATION(4021, "Location is required", HttpStatus.BAD_REQUEST),
	REQUIRED_ORGANIZER(4022, "Organizer is required", HttpStatus.BAD_REQUEST),
	REQUIRED_CONTACT_PHONE(4023, "Contact phone is required", HttpStatus.BAD_REQUEST),
	REQUIRED_CONTACT_EMAIL(4024, "Contact email is required", HttpStatus.BAD_REQUEST),
	REQUIRED_START_TIME(4025, "Start time is required", HttpStatus.BAD_REQUEST),
	REQUIRED_END_TIME(4026, "End time is required", HttpStatus.BAD_REQUEST),
	REQUIRED_ACTIVITY_ADDRESS(4027, "Activity address is required", HttpStatus.BAD_REQUEST),
	REQUIRED_ACTIVITY_POINTS(4028, "Activity points are required", HttpStatus.BAD_REQUEST),
    //Authentication
	AUTHENTICATION_FAILED(5001, "Authentication failed", HttpStatus.UNAUTHORIZED),
	USERNAME_NOT_FOUND(5002, "Username not found", HttpStatus.NOT_FOUND),
	INVALID_PASSWORD(5003, "Invalid password", HttpStatus.UNAUTHORIZED),
	UNAUTHENTICATED(5004, "Unauthenticated", HttpStatus.UNAUTHORIZED),
	FORBIDDEN(5005, "Unauthorized", HttpStatus.FORBIDDEN),
	INVALID_REFRESH_TOKEN(5006, "Invalid refresh token", HttpStatus.UNAUTHORIZED),
    USER_DISABLED(5007,"This user account has been disabled.",HttpStatus.BAD_REQUEST),
    //Schedule
    SCHEDULE_NOT_FOUND(5500, "Schedule not found", HttpStatus.NOT_FOUND),
    DATE_TOO_RECENT(5501,"Start date must be earlier than 5 days before today",HttpStatus.BAD_REQUEST),
    UPDATE_SCHEDULE_TOO_LATE(5503,"Update schedule is not allowed within 2 days of the start date.",HttpStatus.BAD_REQUEST),
    DATE_IN_PAST(5502,"Schedule date cannot be in the past",HttpStatus.BAD_REQUEST),
    CANNOT_CANCEL_COMPLETED_SCHEDULE(5504,"Cannot cancel a completed schedule",HttpStatus.BAD_REQUEST),
    INTERVIEWER_HAS_SCHEDULE_CONFLICT(5505,"Interviewer has a scheduling conflict",HttpStatus.BAD_REQUEST),
    CANDIDATE_POSITION_MISMATCH(5506,"Candidate's position does not match the schedule position",HttpStatus.BAD_REQUEST),
    REQUIRED_CANCEL_REASON(5507,"Cancel reason is required",HttpStatus.BAD_REQUEST),
    CANNOT_CANCEL_SCHEDULE_WITH_NON_INTERVIEWING_CAND(5508,"Cannot cancel schedule with candidates in 'Interviewed' status",HttpStatus.BAD_REQUEST),
    //candidate
    CANDIDATE_NOT_FOUND(5600, "Candidate not found", HttpStatus.NOT_FOUND),
    CANDIDATE_ALREADY_SCHEDULED(5601, "Candidate has already been scheduled", HttpStatus.BAD_REQUEST),
    CANDIDATE_NOT_IN_SCHEDULE(5062, "Candidate is not assigned to any schedule", HttpStatus.BAD_REQUEST),
    REQUIRED_RATING_TECHNICAL(5063, "Technical rating is required", HttpStatus.BAD_REQUEST),
    REQUIRED_RATING_COMMUNICATION(5064, "Communication rating is required", HttpStatus.BAD_REQUEST),
    REQUIRED_RATING_PROBLEM_SOLVING(5065, "Problem solving rating is required", HttpStatus.BAD_REQUEST),
    REQUIRED_RATING_EXPERIENCE(5066, "Experience rating is required", HttpStatus.BAD_REQUEST),
    REQUIRED_RATING_CULTURE_FIT(5067, "Culture fit rating is required", HttpStatus.BAD_REQUEST),
    INVALID_FEEDBACK_LENGTH(5068, "Feedback must not exceed 1000 characters", HttpStatus.BAD_REQUEST),
    CANDIDATE_CANNOT_BE_UPDATED(5069, "Candidate cannot be updated in the current status", HttpStatus.BAD_REQUEST),
    CANDIDATE_CANNOT_BE_HIRED(5070, "Only candidates with 'Interviewed' status can be hired", HttpStatus.BAD_REQUEST),
    IMPORT_CANDIDATE_FAIL(5071,"Import candidate fail", HttpStatus.BAD_REQUEST),
    FULLNAME_REQUIRED(5072,"Full name is required", HttpStatus.BAD_REQUEST),
    EMAIL_REQUIRED(5073,"Email is required", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(5074,"Invalid email format", HttpStatus.BAD_REQUEST),
    PHONE_REQUIRED(5075,"Phone number is required", HttpStatus.BAD_REQUEST),
    BIRTHDAY_INVALID(5076,"Invalid birthdate format", HttpStatus.BAD_REQUEST),
    BIRTHDATE_REQUIRED(5077,"Birthdate is required", HttpStatus.BAD_REQUEST),
    //Activity
    START_DATE_TOO_RECENT(4050,"Start date must be earlier than 7 days before today",HttpStatus.BAD_REQUEST),
    REGISTRATION_TOO_LATE(4051,"Registration is no longer allowed within 3 days of the start date.",HttpStatus.BAD_REQUEST),
    ACTIVITY_FULL(4052,"This activity is fully booked.",HttpStatus.BAD_REQUEST),
    CANCELLATION_TOO_LATE(4053,"Cancellation is not allowed within 3 days of the start date.",HttpStatus.BAD_REQUEST),
    UPDATE_TOO_LATE(4054,"Update is not allowed within 7 days of the start date.",HttpStatus.BAD_REQUEST),

    //Timesheet
	TIMESHEET_NOT_FOUND(4001, "Timesheet not found", HttpStatus.NOT_FOUND),
	CHECK_TIME_REQUIRED(4002,"Check-in and check-out time are required", HttpStatus.BAD_REQUEST),
	WORK_DURATION_TOO_LONG(4003,"Work duration cannot exceed 24 hours", HttpStatus.BAD_REQUEST),
	//Timesheet request
	TIMESHEET_REQUEST_NOT_FOUND(6001, "Timesheet request not found", HttpStatus.NOT_FOUND),
	//WFH Request
	WFH_REQUEST_NOT_FOUND(6002, "WFH request not found", HttpStatus.NOT_FOUND),
	//Leave Request
	LEAVE_REQUEST_NOT_FOUND(6003, "Leave request not found", HttpStatus.NOT_FOUND),
	//Request
	REQUEST_NOT_FOUND(6004, "Request not found", HttpStatus.NOT_FOUND),
    REQUIRED_SCHEDULE_TIME_SLOT(6005, "Time slot is required", HttpStatus.BAD_REQUEST),
    REQUIRED_SCHEDULE_DATE(6008, "Date is required", HttpStatus.BAD_REQUEST),
    REQUIRED_SCHEDULE_LOCATION(6006, "Location is required", HttpStatus.BAD_REQUEST),
    REQUIRED_INTERVIEWER_ID(6007, "Interviewer id is required", HttpStatus.BAD_REQUEST),
    REQUIRED_SCHEDULE_ID(6009, "Location id is required", HttpStatus.BAD_REQUEST),
    REQUIRED_CANDIDATE_IDS(6010, "Candidate id is required", HttpStatus.BAD_REQUEST),
    //File Upload
	FILE_UPLOAD_FAILED(7000,"File upload failed", HttpStatus.INTERNAL_SERVER_ERROR),
	GENERATE_URL_FAILED(7003,"Generate file URL failed", HttpStatus.INTERNAL_SERVER_ERROR),
	FILE_REQUIRED(7004,"File is required", HttpStatus.BAD_REQUEST),
	//Project
	PROJECT_NOT_FOUND(8001, "Project not found", HttpStatus.NOT_FOUND),
	PROJECT_CODE_ALREADY_EXISTS(8002, "Project code already exists", HttpStatus.BAD_REQUEST),
	REQUIRED_PROJECT_NAME(8003, "Project name is required", HttpStatus.BAD_REQUEST),
	REQUIRED_PROJECT_PRIORITY(8004, "Project priority is required", HttpStatus.BAD_REQUEST),
	REQUIRED_DEPARTMENT_ID(8005, "Department ID is required", HttpStatus.BAD_REQUEST),
	REQUIRED_PROJECT_CODE(8006, "Project code is required", HttpStatus.BAD_REQUEST),
	REQUIRED_PROJECT_START_DATE(8007, "Project start date is required", HttpStatus.BAD_REQUEST),
	REQUIRED_PROJECT_END_DATE(8008, "Project end date is required", HttpStatus.BAD_REQUEST),
    //Salary
    PAYROLL_NOT_PAYMENT_DAY(6500,"Today is not payday (the 15th)",HttpStatus.BAD_REQUEST),
    PAYROLL_ALREADY_GENERATED(6501,"This month's payroll has already been exported",HttpStatus.BAD_REQUEST),
    PAYROLL_NOT_GENERATED(6502,"This month's payroll hasn't been released yet.",HttpStatus.BAD_REQUEST),
    PAYROLL_ALREADY_PAID(6502,"This month's salary has been paid",HttpStatus.BAD_REQUEST),
	//Task
	TASK_NOT_FOUND(9001, "Task not found", HttpStatus.NOT_FOUND),
	REQUIRED_TASK_NAME(9002, "Task name is required", HttpStatus.BAD_REQUEST),
	REQUIRED_TASK_DESCRIPTION(9003, "Task description is required", HttpStatus.BAD_REQUEST),
	REQUIRED_TASK_PRIORITY(9004, "Task priority is required", HttpStatus.BAD_REQUEST),
	REQUIRED_TASK_TIME_SPENT(9005, "Task time spent is required", HttpStatus.BAD_REQUEST),
	REQUIRED_TASK_START_DATE(9006, "Task start date is required", HttpStatus.BAD_REQUEST),
	REQUIRED_TASK_DUE_DATE(9007, "Task due date is required", HttpStatus.BAD_REQUEST),
	REQUIRED_PROJECT_ID(9008, "Project ID is required", HttpStatus.BAD_REQUEST),
	REQUIRED_EMPLOYEE_ID(9009, "Employee ID is required", HttpStatus.BAD_REQUEST),
	FILE_PROCESSING_ERROR(7010,"File processing error", HttpStatus.INTERNAL_SERVER_ERROR),
	//Import
	IMPORT_TIMESHEET_FAIL(7001,"Import timesheet fail", HttpStatus.BAD_REQUEST),
	FILE_INVALID_FORMAT(7002,"File has invalid format", HttpStatus.BAD_REQUEST),
	TYPE_MISMATCH(40013,"Type mismatch error", HttpStatus.BAD_REQUEST),
	ACTIVITY_NOT_FOUND(40010,"Activity not found", HttpStatus.NOT_FOUND),
	IMPORT_EMPLOYEE_FAIL(40011,"Import employee fail", HttpStatus.BAD_REQUEST),
	INVALID_DATE_FORMAT(40012,"Invalid date format", HttpStatus.BAD_REQUEST),
	INVALID_ENUM_VALUE(40013,"Invalid enum value", HttpStatus.BAD_REQUEST),
	INVALID_NUMBER_FORMAT(40014,"Invalid number format", HttpStatus.BAD_REQUEST),
	ACTIVITY_DETAIL_NOT_FOUND(40015, "Activity Detail Not Found", HttpStatus.BAD_REQUEST),
	POINT_EXCHANGE_NOT_FOUND(40016, "Point exchange request not found", HttpStatus.NOT_FOUND),
	INSUFFICIENT_POINTS(40017, "Insufficient points for exchange", HttpStatus.BAD_REQUEST),
	INVALID_STATUS_TRANSITION(40018, "Invalid status transition", HttpStatus.BAD_REQUEST),
	POINT_EXCHANGE_FINAL_STATE(40019, "Point exchange request is in a final state and cannot be modified", HttpStatus.BAD_REQUEST),
	INVALID_STATUS(40020, "Invalid status provided", HttpStatus.BAD_REQUEST),
	INVALID_POINT_AMOUNT(40021, "Invalid point amount", HttpStatus.BAD_REQUEST),
	INVALID_DATE_RANGE(40022, "Invalid date range", HttpStatus.BAD_REQUEST),
	CANNOT_REQUEST_PAST_DATE(40023, "Cannot request for past dates", HttpStatus.BAD_REQUEST),
	CANNOT_REQUEST_FUTURE_DATE(40024, "Cannot request for future dates", HttpStatus.BAD_REQUEST),
	WORK_DATE_TOO_OLD(40025, "Work date is too old", HttpStatus.BAD_REQUEST),
	VIOLATE_DATA_INTEGRITY(40026,"Data integrity violation", HttpStatus.BAD_REQUEST),
	DUPLICATE_PROJECT_MEMBER(8009, "Duplicate project member", HttpStatus.BAD_REQUEST),
	INVALID_DATETIME(40027, "Invalid date time format", HttpStatus.BAD_REQUEST),
	//Point History
	INVALID_ENUM(40013,"Invalid enum value", HttpStatus.BAD_REQUEST),
	IMPORT_INVALID_BOOLEAN_FORMAT(40014,"Invalid boolean format", HttpStatus.BAD_REQUEST),
	ALREADY_REGISTERED_ACTIVITY(4055,"Employee has already registered for this activity",HttpStatus.BAD_REQUEST),
	ACTIVITY_RESULT_ALREADY_EXISTS(4056,"Activity result for this participant already exists",HttpStatus.BAD_REQUEST),
	CANNOT_CANCEL_ACTIVITY(4057,"Cannot cancel this activity",HttpStatus.BAD_REQUEST),
	CANNOT_REGISTER_ACTIVITY(4057,"Cannot register for this activity",HttpStatus.BAD_REQUEST),
	PAYROLL_GENERATION_DATE_INVALID(6503,"Payroll can only be generated on the 30th or 31st of the month",HttpStatus.BAD_REQUEST),
	ATTENDANCE_SUMMARY_NOT_FOUND(6504,"Attendance summary not found for employee",HttpStatus.NOT_FOUND),
	SALARY_NOT_FOUND(6505,"Salary record not found for employee",HttpStatus.NOT_FOUND),
	BANK_NOT_SUPPORTED(7005,"Bank not supported for transfers", HttpStatus.BAD_REQUEST),
	HOLIDAY_NOT_FOUND(40013,"Holiday not found", HttpStatus.NOT_FOUND),
	INSUFFICIENT_ALLOCATE_POINTS(40014,"Insufficient allocate points", HttpStatus.BAD_REQUEST),
	INSUFFICIENT_CASUAL_LEAVE_BALANCE(40014,"Insufficient casual leave balance", HttpStatus.BAD_REQUEST),
	INVALID_INPUT(40014,"Invalid input", HttpStatus.BAD_REQUEST);

	private final Integer code;
	private final String message;
	private final HttpStatus httpStatus;
}

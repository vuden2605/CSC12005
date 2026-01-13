package com.csc12005.hr.Exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

	// Success
	SUCCESS(9999, "Thành công", HttpStatus.OK),
	INTERNAL_SERVER_ERROR(500, "Lỗi máy chủ nội bộ", HttpStatus.INTERNAL_SERVER_ERROR),

	// Employee
	EMPLOYEE_NOT_FOUND(1001, "Không tìm thấy nhân viên", HttpStatus.NOT_FOUND),
	EMAIL_ALREADY_EXISTS(1002, "Email đã tồn tại", HttpStatus.BAD_REQUEST),

	// Department
	DEPARTMENT_NOT_FOUND(2001, "Không tìm thấy phòng ban", HttpStatus.NOT_FOUND),
	DEPARTMENT_CODE_ALREADY_EXISTS(2002, "Mã phòng ban đã tồn tại", HttpStatus.BAD_REQUEST),

	// Position
	POSITION_NOT_FOUND(3001, "Không tìm thấy chức vụ", HttpStatus.NOT_FOUND),

	// Validation
	VALIDATION_FAILED(4001, "Dữ liệu không hợp lệ", HttpStatus.BAD_REQUEST),
	REQUIRED_FULL_NAME(4002, "Họ và tên là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_EMAIL(4003, "Email là bắt buộc", HttpStatus.BAD_REQUEST),
	INVALID_EMAIL(4004, "Định dạng email không hợp lệ", HttpStatus.BAD_REQUEST),
	INVALID_PHONE(4005, "Định dạng số điện thoại không hợp lệ", HttpStatus.BAD_REQUEST),
	REQUIRED_ADDRESS(4006, "Địa chỉ là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_TIMESHEET_ID(4007, "Mã chấm công là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_REQUEST_ATTACHMENT(4008, "Tệp đính kèm là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_REASON(4009, "Lý do là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_CHECK_IN_NEW(4010, "Thời gian check-in mới là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_CHECK_OUT_NEW(4011, "Thời gian check-out mới là bắt buộc", HttpStatus.BAD_REQUEST),
	CHECK_IN_MUST_BE_BEFORE_CHECK_OUT(4012, "Giờ check-in phải trước giờ check-out", HttpStatus.BAD_REQUEST),
	REQUIRED_WORK_DATE(4014, "Ngày làm việc là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_START_DATE(4015, "Ngày bắt đầu là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_END_DATE(4016, "Ngày kết thúc là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_ACTIVITY_NAME(4017, "Tên hoạt động là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_ACTIVITY_TYPE(4018, "Loại hoạt động là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_REGISTRATION_DEADLINE(4019, "Hạn đăng ký là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_MAX_PARTICIPANTS(4020, "Số người tham gia tối đa là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_LOCATION(4021, "Địa điểm là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_ORGANIZER(4022, "Đơn vị tổ chức là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_CONTACT_PHONE(4023, "Số điện thoại liên hệ là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_CONTACT_EMAIL(4024, "Email liên hệ là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_START_TIME(4025, "Thời gian bắt đầu là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_END_TIME(4026, "Thời gian kết thúc là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_ACTIVITY_ADDRESS(4027, "Địa chỉ hoạt động là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_ACTIVITY_POINTS(4028, "Điểm hoạt động là bắt buộc", HttpStatus.BAD_REQUEST),

	// Authentication
	AUTHENTICATION_FAILED(5001, "Xác thực thất bại", HttpStatus.UNAUTHORIZED),
	USERNAME_NOT_FOUND(5002, "Không tìm thấy tên đăng nhập", HttpStatus.NOT_FOUND),
	INVALID_PASSWORD(5003, "Mật khẩu không đúng", HttpStatus.UNAUTHORIZED),
	UNAUTHENTICATED(5004, "Chưa xác thực", HttpStatus.UNAUTHORIZED),
	FORBIDDEN(5005, "Không có quyền truy cập", HttpStatus.FORBIDDEN),
	INVALID_REFRESH_TOKEN(5006, "Refresh token không hợp lệ", HttpStatus.UNAUTHORIZED),
	USER_DISABLED(5007, "Tài khoản người dùng đã bị vô hiệu hóa", HttpStatus.BAD_REQUEST),

	// Schedule
	SCHEDULE_NOT_FOUND(5500, "Không tìm thấy lịch", HttpStatus.NOT_FOUND),
	DATE_TOO_RECENT(5501, "Ngày bắt đầu phải sớm hơn ít nhất 5 ngày so với hôm nay", HttpStatus.BAD_REQUEST),
	UPDATE_SCHEDULE_TOO_LATE(5503, "Không được cập nhật lịch trong vòng 2 ngày trước ngày bắt đầu", HttpStatus.BAD_REQUEST),
	DATE_IN_PAST(5502, "Ngày lịch không được nằm trong quá khứ", HttpStatus.BAD_REQUEST),
	CANNOT_CANCEL_COMPLETED_SCHEDULE(5504, "Không thể hủy lịch đã hoàn thành", HttpStatus.BAD_REQUEST),
	INTERVIEWER_HAS_SCHEDULE_CONFLICT(5505, "Người phỏng vấn bị trùng lịch", HttpStatus.BAD_REQUEST),
	CANDIDATE_POSITION_MISMATCH(5506, "Vị trí ứng viên không khớp với lịch", HttpStatus.BAD_REQUEST),
	REQUIRED_CANCEL_REASON(5507, "Lý do hủy là bắt buộc", HttpStatus.BAD_REQUEST),
	CANNOT_CANCEL_SCHEDULE_WITH_NON_INTERVIEWING_CAND(5508, "Không thể hủy lịch có ứng viên đã phỏng vấn", HttpStatus.BAD_REQUEST),

	// Candidate
	CANDIDATE_NOT_FOUND(5600, "Không tìm thấy ứng viên", HttpStatus.NOT_FOUND),
	CANDIDATE_ALREADY_SCHEDULED(5601, "Ứng viên đã được lên lịch", HttpStatus.BAD_REQUEST),
	CANDIDATE_NOT_IN_SCHEDULE(5062, "Ứng viên không thuộc lịch nào", HttpStatus.BAD_REQUEST),
	REQUIRED_RATING_TECHNICAL(5063, "Đánh giá kỹ thuật là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_RATING_COMMUNICATION(5064, "Đánh giá giao tiếp là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_RATING_PROBLEM_SOLVING(5065, "Đánh giá giải quyết vấn đề là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_RATING_EXPERIENCE(5066, "Đánh giá kinh nghiệm là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_RATING_CULTURE_FIT(5067, "Đánh giá phù hợp văn hóa là bắt buộc", HttpStatus.BAD_REQUEST),
	INVALID_FEEDBACK_LENGTH(5068, "Nhận xét không được vượt quá 1000 ký tự", HttpStatus.BAD_REQUEST),
	CANDIDATE_CANNOT_BE_UPDATED(5069, "Không thể cập nhật ứng viên ở trạng thái hiện tại", HttpStatus.BAD_REQUEST),
	CANDIDATE_CANNOT_BE_HIRED(5070, "Chỉ có thể tuyển ứng viên đã phỏng vấn", HttpStatus.BAD_REQUEST),
	IMPORT_CANDIDATE_FAIL(5071, "Nhập dữ liệu ứng viên thất bại", HttpStatus.BAD_REQUEST),

	// Activity
	START_DATE_TOO_RECENT(4050, "Ngày bắt đầu phải sớm hơn ít nhất 7 ngày so với hôm nay", HttpStatus.BAD_REQUEST),
	REGISTRATION_TOO_LATE(4051, "Không thể đăng ký khi còn dưới 3 ngày trước ngày bắt đầu", HttpStatus.BAD_REQUEST),
	ACTIVITY_FULL(4052, "Hoạt động đã đủ người tham gia", HttpStatus.BAD_REQUEST),
	CANCELLATION_TOO_LATE(4053, "Không thể hủy trong vòng 3 ngày trước ngày bắt đầu", HttpStatus.BAD_REQUEST),
	UPDATE_TOO_LATE(4054, "Không thể cập nhật trong vòng 7 ngày trước ngày bắt đầu", HttpStatus.BAD_REQUEST),

	// File Upload
	FILE_UPLOAD_FAILED(7000, "Tải tệp lên thất bại", HttpStatus.INTERNAL_SERVER_ERROR),
	FILE_REQUIRED(7004, "Tệp là bắt buộc", HttpStatus.BAD_REQUEST),

	// Project
	PROJECT_NOT_FOUND(8001, "Không tìm thấy dự án", HttpStatus.NOT_FOUND),
	PROJECT_CODE_ALREADY_EXISTS(8002, "Mã dự án đã tồn tại", HttpStatus.BAD_REQUEST),

	// Task
	TASK_NOT_FOUND(9001, "Không tìm thấy công việc", HttpStatus.NOT_FOUND),

	// Common
	INVALID_ENUM_VALUE(40013, "Giá trị enum không hợp lệ", HttpStatus.BAD_REQUEST),
	INVALID_DATE_FORMAT(40012, "Định dạng ngày không hợp lệ", HttpStatus.BAD_REQUEST),
	INVALID_NUMBER_FORMAT(40014, "Định dạng số không hợp lệ", HttpStatus.BAD_REQUEST),
	INVALID_INPUT(40014, "Dữ liệu đầu vào không hợp lệ", HttpStatus.BAD_REQUEST);

	private final Integer code;
	private final String message;
	private final HttpStatus httpStatus;
}

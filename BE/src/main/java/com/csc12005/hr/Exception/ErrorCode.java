package com.csc12005.hr.Exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
	//Success
	SUCCESS(9999, "Thành công", HttpStatus.OK),
	INTERNAL_SERVER_ERROR(500, "Lỗi máy chủ nội bộ", HttpStatus.INTERNAL_SERVER_ERROR),
	//Employee
	EMPLOYEE_NOT_FOUND(1001, "Không tìm thấy nhân viên", HttpStatus.NOT_FOUND),
	EMAIL_ALREADY_EXISTS(1002, "Email đã tồn tại", HttpStatus.BAD_REQUEST),
	//Department
	DEPARTMENT_NOT_FOUND(2001, "Không tìm thấy phòng ban", HttpStatus.NOT_FOUND),
	DEPARTMENT_CODE_ALREADY_EXISTS(2002, "Mã phòng ban đã tồn tại", HttpStatus.BAD_REQUEST),
	//Position
	POSITION_NOT_FOUND(3001, "Không tìm thấy vị trí", HttpStatus.NOT_FOUND),
	//Validation
	VALIDATION_FAILED(4001, "Xác thực thất bại", HttpStatus.BAD_REQUEST),
	REQUIRED_FULL_NAME(4002, "Họ và tên là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_EMAIL(4003, "Email là bắt buộc", HttpStatus.BAD_REQUEST),
	INVALID_EMAIL(4004, "Định dạng email không hợp lệ", HttpStatus.BAD_REQUEST),
	INVALID_PHONE(4005, "Định dạng số điện thoại không hợp lệ", HttpStatus.BAD_REQUEST),
	REQUIRED_ADDRESS(4006, "Địa chỉ là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_TIMESHEET_ID(4007, "ID bảng chấm công là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_REQUEST_ATTACHMENT(4008, "Tệp đính kèm yêu cầu là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_REASON(4009, "Lý do là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_CHECK_IN_NEW(4010, "Thời gian check-in mới là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_CHECK_OUT_NEW(4011, "Thời gian check-out mới là bắt buộc", HttpStatus.BAD_REQUEST),
	CHECK_IN_MUST_BE_BEFORE_CHECK_OUT(4012, "Thời gian check-in phải trước thời gian check-out", HttpStatus.BAD_REQUEST),
	REQUIRED_WORK_DATE(4014, "Ngày làm việc là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_START_DATE(4015, "Ngày bắt đầu là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_END_DATE(4016, "Ngày kết thúc là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_ACTIVITY_NAME(4017, "Tên hoạt động là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_ACTIVITY_TYPE(4018, "Loại hoạt động là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_REGISTRATION_DEADLINE(4019, "Hạn đăng ký là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_MAX_PARTICIPANTS(4020, "Số lượng người tham gia tối đa là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_LOCATION(4021, "Địa điểm là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_ORGANIZER(4022, "Đơn vị tổ chức là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_CONTACT_PHONE(4023, "Số điện thoại liên hệ là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_CONTACT_EMAIL(4024, "Email liên hệ là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_START_TIME(4025, "Thời gian bắt đầu là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_END_TIME(4026, "Thời gian kết thúc là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_ACTIVITY_ADDRESS(4027, "Địa chỉ hoạt động là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_ACTIVITY_POINTS(4028, "Điểm hoạt động là bắt buộc", HttpStatus.BAD_REQUEST),
	//Authentication
	AUTHENTICATION_FAILED(5001, "Xác thực thất bại", HttpStatus.UNAUTHORIZED),
	USERNAME_NOT_FOUND(5002, "Không tìm thấy tên người dùng", HttpStatus.NOT_FOUND),
	INVALID_PASSWORD(5003, "Mật khẩu không hợp lệ", HttpStatus.UNAUTHORIZED),
	UNAUTHENTICATED(5004, "Chưa xác thực", HttpStatus.UNAUTHORIZED),
	FORBIDDEN(5005, "Không có quyền truy cập", HttpStatus.FORBIDDEN),
	INVALID_REFRESH_TOKEN(5006, "Token làm mới không hợp lệ", HttpStatus.UNAUTHORIZED),
	USER_DISABLED(5007,"Tài khoản người dùng này đã bị vô hiệu hóa",HttpStatus.BAD_REQUEST),
	//Schedule
	SCHEDULE_NOT_FOUND(5500, "Không tìm thấy lịch hẹn", HttpStatus.NOT_FOUND),
	DATE_TOO_RECENT(5501,"Ngày bắt đầu phải sớm hơn 5 ngày so với hôm nay",HttpStatus.BAD_REQUEST),
	UPDATE_SCHEDULE_TOO_LATE(5503,"Không thể cập nhật lịch hẹn trong vòng 2 ngày trước ngày bắt đầu",HttpStatus.BAD_REQUEST),
	DATE_IN_PAST(5502,"Ngày lịch hẹn không thể trong quá khứ",HttpStatus.BAD_REQUEST),
	CANNOT_CANCEL_COMPLETED_SCHEDULE(5504,"Không thể hủy lịch hẹn đã hoàn thành",HttpStatus.BAD_REQUEST),
	INTERVIEWER_HAS_SCHEDULE_CONFLICT(5505,"Người phỏng vấn có xung đột lịch hẹn",HttpStatus.BAD_REQUEST),
	CANDIDATE_POSITION_MISMATCH(5506,"Vị trí ứng tuyển không khớp với vị trí của lịch hẹn",HttpStatus.BAD_REQUEST),
	REQUIRED_CANCEL_REASON(5507,"Lý do hủy là bắt buộc",HttpStatus.BAD_REQUEST),
	CANNOT_CANCEL_SCHEDULE_WITH_NON_INTERVIEWING_CAND(5508,"Không thể hủy lịch hẹn với ứng viên có trạng thái 'Đã phỏng vấn'",HttpStatus.BAD_REQUEST),
	//candidate
	CANDIDATE_NOT_FOUND(5600, "Không tìm thấy ứng viên", HttpStatus.NOT_FOUND),
	CANDIDATE_ALREADY_SCHEDULED(5601, "Ứng viên đã được xếp lịch", HttpStatus.BAD_REQUEST),
	CANDIDATE_NOT_IN_SCHEDULE(5062, "Ứng viên chưa được phân công vào lịch hẹn nào", HttpStatus.BAD_REQUEST),
	REQUIRED_RATING_TECHNICAL(5063, "Đánh giá kỹ thuật là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_RATING_COMMUNICATION(5064, "Đánh giá giao tiếp là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_RATING_PROBLEM_SOLVING(5065, "Đánh giá giải quyết vấn đề là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_RATING_EXPERIENCE(5066, "Đánh giá kinh nghiệm là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_RATING_CULTURE_FIT(5067, "Đánh giá phù hợp văn hóa là bắt buộc", HttpStatus.BAD_REQUEST),
	INVALID_FEEDBACK_LENGTH(5068, "Nhận xét không được vượt quá 1000 ký tự", HttpStatus.BAD_REQUEST),
	CANDIDATE_CANNOT_BE_UPDATED(5069, "Không thể cập nhật ứng viên ở trạng thái hiện tại", HttpStatus.BAD_REQUEST),
	CANDIDATE_CANNOT_BE_HIRED(5070, "Chỉ ứng viên có trạng thái 'Đã phỏng vấn' mới có thể được tuyển dụng", HttpStatus.BAD_REQUEST),
	IMPORT_CANDIDATE_FAIL(5071,"Nhập ứng viên thất bại", HttpStatus.BAD_REQUEST),
	FULLNAME_REQUIRED(5072,"Họ và tên là bắt buộc", HttpStatus.BAD_REQUEST),
	EMAIL_REQUIRED(5073,"Email là bắt buộc", HttpStatus.BAD_REQUEST),
	EMAIL_INVALID(5074,"Định dạng email không hợp lệ", HttpStatus.BAD_REQUEST),
	PHONE_REQUIRED(5075,"Số điện thoại là bắt buộc", HttpStatus.BAD_REQUEST),
	BIRTHDAY_INVALID(5076,"Định dạng ngày sinh không hợp lệ", HttpStatus.BAD_REQUEST),
	BIRTHDATE_REQUIRED(5077,"Ngày sinh là bắt buộc", HttpStatus.BAD_REQUEST),
	//Activity
	START_DATE_TOO_RECENT(4050,"Ngày bắt đầu phải sớm hơn 7 ngày so với hôm nay",HttpStatus.BAD_REQUEST),
	REGISTRATION_TOO_LATE(4051,"Không thể đăng ký trong vòng 3 ngày trước ngày bắt đầu",HttpStatus.BAD_REQUEST),
	ACTIVITY_FULL(4052,"Hoạt động này đã đầy",HttpStatus.BAD_REQUEST),
	CANCELLATION_TOO_LATE(4053,"Không thể hủy trong vòng 3 ngày trước ngày bắt đầu",HttpStatus.BAD_REQUEST),
	UPDATE_TOO_LATE(4054,"Không thể cập nhật trong vòng 7 ngày trước ngày bắt đầu",HttpStatus.BAD_REQUEST),

	//Timesheet
	TIMESHEET_NOT_FOUND(4001, "Không tìm thấy bảng chấm công", HttpStatus.NOT_FOUND),
	CHECK_TIME_REQUIRED(4002,"Thời gian check-in và check-out là bắt buộc", HttpStatus.BAD_REQUEST),
	WORK_DURATION_TOO_LONG(4003,"Thời gian làm việc không được vượt quá 24 giờ", HttpStatus.BAD_REQUEST),
	//Timesheet request
	TIMESHEET_REQUEST_NOT_FOUND(6001, "Không tìm thấy yêu cầu chấm công", HttpStatus.NOT_FOUND),
	//WFH Request
	WFH_REQUEST_NOT_FOUND(6002, "Không tìm thấy yêu cầu làm việc tại nhà", HttpStatus.NOT_FOUND),
	//Leave Request
	LEAVE_REQUEST_NOT_FOUND(6003, "Không tìm thấy yêu cầu nghỉ phép", HttpStatus.NOT_FOUND),
	//Request
	REQUEST_NOT_FOUND(6004, "Không tìm thấy yêu cầu", HttpStatus.NOT_FOUND),
	REQUIRED_SCHEDULE_TIME_SLOT(6005, "Khung giờ là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_SCHEDULE_DATE(6008, "Ngày là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_SCHEDULE_LOCATION(6006, "Địa điểm là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_INTERVIEWER_ID(6007, "ID người phỏng vấn là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_SCHEDULE_ID(6009, "ID địa điểm là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_CANDIDATE_IDS(6010, "ID ứng viên là bắt buộc", HttpStatus.BAD_REQUEST),
	//File Upload
	FILE_UPLOAD_FAILED(7000,"Tải tệp lên thất bại", HttpStatus.INTERNAL_SERVER_ERROR),
	GENERATE_URL_FAILED(7003,"Tạo URL tệp thất bại", HttpStatus.INTERNAL_SERVER_ERROR),
	FILE_REQUIRED(7004,"Tệp là bắt buộc", HttpStatus.BAD_REQUEST),
	//Project
	PROJECT_NOT_FOUND(8001, "Không tìm thấy dự án", HttpStatus.NOT_FOUND),
	PROJECT_CODE_ALREADY_EXISTS(8002, "Mã dự án đã tồn tại", HttpStatus.BAD_REQUEST),
	REQUIRED_PROJECT_NAME(8003, "Tên dự án là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_PROJECT_PRIORITY(8004, "Độ ưu tiên dự án là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_DEPARTMENT_ID(8005, "ID phòng ban là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_PROJECT_CODE(8006, "Mã dự án là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_PROJECT_START_DATE(8007, "Ngày bắt đầu dự án là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_PROJECT_END_DATE(8008, "Ngày kết thúc dự án là bắt buộc", HttpStatus.BAD_REQUEST),
	//Salary
	PAYROLL_NOT_PAYMENT_DAY(6500,"Hôm nay không phải ngày trả lương (ngày 15)",HttpStatus.BAD_REQUEST),
	PAYROLL_ALREADY_GENERATED(6501,"Bảng lương tháng này đã được xuất",HttpStatus.BAD_REQUEST),
	PAYROLL_NOT_GENERATED(6502,"Bảng lương tháng này chưa được phát hành",HttpStatus.BAD_REQUEST),
	PAYROLL_ALREADY_PAID(6502,"Lương tháng này đã được thanh toán",HttpStatus.BAD_REQUEST),
	//Task
	TASK_NOT_FOUND(9001, "Không tìm thấy nhiệm vụ", HttpStatus.NOT_FOUND),
	REQUIRED_TASK_NAME(9002, "Tên nhiệm vụ là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_TASK_DESCRIPTION(9003, "Mô tả nhiệm vụ là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_TASK_PRIORITY(9004, "Độ ưu tiên nhiệm vụ là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_TASK_TIME_SPENT(9005, "Thời gian thực hiện nhiệm vụ là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_TASK_START_DATE(9006, "Ngày bắt đầu nhiệm vụ là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_TASK_DUE_DATE(9007, "Hạn hoàn thành nhiệm vụ là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_PROJECT_ID(9008, "ID dự án là bắt buộc", HttpStatus.BAD_REQUEST),
	REQUIRED_EMPLOYEE_ID(9009, "ID nhân viên là bắt buộc", HttpStatus.BAD_REQUEST),
	FILE_PROCESSING_ERROR(7010,"Lỗi xử lý tệp", HttpStatus.INTERNAL_SERVER_ERROR),
	//Import
	IMPORT_TIMESHEET_FAIL(7001,"Nhập bảng chấm công thất bại", HttpStatus.BAD_REQUEST),
	FILE_INVALID_FORMAT(7002,"Định dạng tệp không hợp lệ", HttpStatus.BAD_REQUEST),
	TYPE_MISMATCH(40013,"Lỗi không khớp kiểu dữ liệu", HttpStatus.BAD_REQUEST),
	ACTIVITY_NOT_FOUND(40010,"Không tìm thấy hoạt động", HttpStatus.NOT_FOUND),
	IMPORT_EMPLOYEE_FAIL(40011,"Nhập nhân viên thất bại", HttpStatus.BAD_REQUEST),
	INVALID_DATE_FORMAT(40012,"Định dạng ngày không hợp lệ", HttpStatus.BAD_REQUEST),
	INVALID_ENUM_VALUE(40013,"Giá trị enum không hợp lệ", HttpStatus.BAD_REQUEST),
	INVALID_NUMBER_FORMAT(40014,"Định dạng số không hợp lệ", HttpStatus.BAD_REQUEST),
	ACTIVITY_DETAIL_NOT_FOUND(40015, "Không tìm thấy chi tiết hoạt động", HttpStatus.BAD_REQUEST),
	POINT_EXCHANGE_NOT_FOUND(40016, "Không tìm thấy yêu cầu đổi điểm", HttpStatus.NOT_FOUND),
	INSUFFICIENT_POINTS(40017, "Không đủ điểm để đổi", HttpStatus.BAD_REQUEST),
	INVALID_STATUS_TRANSITION(40018, "Chuyển đổi trạng thái không hợp lệ", HttpStatus.BAD_REQUEST),
	POINT_EXCHANGE_FINAL_STATE(40019, "Yêu cầu đổi điểm đã ở trạng thái cuối cùng và không thể thay đổi", HttpStatus.BAD_REQUEST),
	INVALID_STATUS(40020, "Trạng thái không hợp lệ", HttpStatus.BAD_REQUEST),
	INVALID_POINT_AMOUNT(40021, "Số điểm không hợp lệ", HttpStatus.BAD_REQUEST),
	INVALID_DATE_RANGE(40022, "Khoảng thời gian không hợp lệ", HttpStatus.BAD_REQUEST),
	CANNOT_REQUEST_PAST_DATE(40023, "Không thể yêu cầu cho ngày trong quá khứ", HttpStatus.BAD_REQUEST),
	CANNOT_REQUEST_FUTURE_DATE(40024, "Không thể yêu cầu cho ngày trong tương lai", HttpStatus.BAD_REQUEST),
	WORK_DATE_TOO_OLD(40025, "Ngày làm việc quá cũ", HttpStatus.BAD_REQUEST),
	VIOLATE_DATA_INTEGRITY(40026,"Vi phạm tính toàn vẹn dữ liệu", HttpStatus.BAD_REQUEST),
	DUPLICATE_PROJECT_MEMBER(8009, "Thành viên dự án trùng lặp", HttpStatus.BAD_REQUEST),
	INVALID_DATETIME(40027, "Định dạng ngày giờ không hợp lệ", HttpStatus.BAD_REQUEST),
	//Point History
	INVALID_ENUM(40013,"Giá trị enum không hợp lệ", HttpStatus.BAD_REQUEST),
	IMPORT_INVALID_BOOLEAN_FORMAT(40014,"Định dạng boolean không hợp lệ", HttpStatus.BAD_REQUEST),
	ALREADY_REGISTERED_ACTIVITY(4055,"Nhân viên đã đăng ký hoạt động này",HttpStatus.BAD_REQUEST),
	ACTIVITY_RESULT_ALREADY_EXISTS(4056,"Kết quả hoạt động cho người tham gia này đã tồn tại",HttpStatus.BAD_REQUEST),
	CANNOT_CANCEL_ACTIVITY(4057,"Không thể hủy hoạt động này",HttpStatus.BAD_REQUEST),
	CANNOT_REGISTER_ACTIVITY(4057,"Không thể đăng ký hoạt động này",HttpStatus.BAD_REQUEST),
	PAYROLL_GENERATION_DATE_INVALID(6503,"Bảng lương chỉ có thể được tạo vào ngày 30 hoặc 31 của tháng",HttpStatus.BAD_REQUEST),
	ATTENDANCE_SUMMARY_NOT_FOUND(6504,"Không tìm thấy tóm tắt chấm công cho nhân viên",HttpStatus.NOT_FOUND),
	SALARY_NOT_FOUND(6505,"Không tìm thấy bản ghi lương cho nhân viên",HttpStatus.NOT_FOUND),
	BANK_NOT_SUPPORTED(7005,"Ngân hàng không hỗ trợ chuyển khoản", HttpStatus.BAD_REQUEST),
	HOLIDAY_NOT_FOUND(40013,"Không tìm thấy ngày nghỉ lễ", HttpStatus.NOT_FOUND),
	INSUFFICIENT_ALLOCATE_POINTS(40014,"Không đủ điểm phân bổ", HttpStatus.BAD_REQUEST),
	NOTIFICATION_NOT_FOUND(40015,"Không tìm thấy thông báo", HttpStatus.NOT_FOUND),
	READING_NOTIFICATION_FAILED(40016,"Đánh dấu thông báo đã đọc thất bại", HttpStatus.BAD_REQUEST),
	INSUFFICIENT_CASUAL_LEAVE_BALANCE(40014,"Không đủ số ngày nghỉ phép", HttpStatus.BAD_REQUEST),
	INVALID_INPUT(40014,"Dữ liệu đầu vào không hợp lệ", HttpStatus.BAD_REQUEST);

	private final Integer code;
	private final String message;
	private final HttpStatus httpStatus;
}
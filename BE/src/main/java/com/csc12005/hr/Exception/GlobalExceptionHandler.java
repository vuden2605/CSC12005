package com.csc12005.hr.Exception;

import com.csc12005.hr.DTO.Response.ApiResponse;
import org.hibernate.TypeMismatchException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.format.DateTimeParseException;
import java.util.Objects;

@ControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<?>> handleGeneralException(Exception e) {
		ApiResponse<?> response = ApiResponse.builder()
				.code(ErrorCode.INTERNAL_SERVER_ERROR.getCode())
				.message(e.getMessage())
				.build();
		return ResponseEntity.status(ErrorCode.INTERNAL_SERVER_ERROR.getCode()).body(response);
	}

	@ExceptionHandler(AppException.class)
	public ResponseEntity<ApiResponse<?>> handleAppException(AppException e) {
		ErrorCode errorCode = e.getErrorCode();
		ApiResponse<?> response = ApiResponse.builder()
				.code(errorCode.getCode())
				.message(errorCode.getMessage())
				.build();
		return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<?>> handleValidationException(MethodArgumentNotValidException e) {
		String errorMessage = Objects.requireNonNull(e.getBindingResult().getFieldError()).getDefaultMessage();
		ErrorCode error;
		try {
			error = ErrorCode.valueOf(errorMessage);
		}
		catch (IllegalArgumentException ex) {
			error = ErrorCode.INVALID_INPUT;
		}

		ApiResponse<?> response = ApiResponse.builder()
				.code(error.getCode())
				.message(error.getMessage())
				.build();
		return ResponseEntity.status(error.getHttpStatus()).body(response);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiResponse<?>> handleAccessDeniedException(AccessDeniedException e) {
		ErrorCode errorCode = ErrorCode.FORBIDDEN;
		ApiResponse<?> response = ApiResponse.builder()
				.code(errorCode.getCode())
				.message(errorCode.getMessage())
				.build();
		return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
	}
	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ApiResponse<?>> handleDataIntegrityViolation(
			DataIntegrityViolationException e) {

		ApiResponse<?> response = ApiResponse.builder()
				.code(ErrorCode.VIOLATE_DATA_INTEGRITY.getCode())
				.message(ErrorCode.VIOLATE_DATA_INTEGRITY.getMessage())
				.build();
		return ResponseEntity
				.status(ErrorCode.VIOLATE_DATA_INTEGRITY.getHttpStatus())
				.body(response);
	}
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ApiResponse<?>> handleTypeMismatch(
			MethodArgumentTypeMismatchException e) {

		if (e.getCause() instanceof DateTimeParseException) {

			ApiResponse<?> response = ApiResponse.builder()
					.code(ErrorCode.INVALID_DATETIME.getCode())
					.message("Invalid date-time format")
					.build();

			return ResponseEntity
					.status(ErrorCode.INVALID_DATETIME.getHttpStatus())
					.body(response);
		}

		if (e.getRequiredType() != null && e.getRequiredType().isEnum()) {

			ApiResponse<?> response = ApiResponse.builder()
					.code(ErrorCode.INVALID_ENUM.getCode())
					.message("Invalid value for enum " + e.getRequiredType().getSimpleName())
					.build();

			return ResponseEntity
					.status(ErrorCode.INVALID_ENUM.getHttpStatus())
					.body(response);
		}

		throw e;
	}


}

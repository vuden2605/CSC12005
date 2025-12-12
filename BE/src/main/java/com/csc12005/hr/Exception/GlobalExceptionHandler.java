package com.csc12005.hr.Exception;

import com.csc12005.hr.DTO.Response.ApiResponse;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.hibernate.TypeMismatchException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.security.access.AccessDeniedException;

import java.time.format.DateTimeParseException;
import java.util.Map;
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
		ErrorCode error = ErrorCode.valueOf(errorMessage);
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
}

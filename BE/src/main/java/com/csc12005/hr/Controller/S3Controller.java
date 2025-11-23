package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Response.ApiResponse;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Service.S3Service.Impl.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
@RestController
@RequiredArgsConstructor
public class S3Controller {
	private final S3Service s3Service;
	@PostMapping("/s3/upload")
	public ApiResponse<String> uploadFile(@RequestParam("file") MultipartFile file) {
		if (file.isEmpty()) {
			return ApiResponse.<String>builder()
					.code(ErrorCode.FILE_REQUIRED.getCode())
					.message(ErrorCode.FILE_REQUIRED.getMessage())
					.build();
		}
		String folder = file.getContentType() == null ? "others"
				: file.getContentType().startsWith("image/") ? "images"
				: file.getContentType().startsWith("video/") ? "videos"
				: file.getContentType().startsWith("audio/") ? "audios"
				: file.getContentType().startsWith("application/pdf") ? "documents"
				: "others";
		String key = s3Service.uploadFile(file, folder);
		return ApiResponse.<String>builder()
				.code(ErrorCode.SUCCESS.getCode())
				.message(ErrorCode.SUCCESS.getMessage())
				.data(key)
				.build();
	}
	@GetMapping("/s3/download")
	public ApiResponse<String> getPresignedUrl(@RequestParam String key) {
		try {
			return ApiResponse.<String>builder()
					.data(s3Service.generatePresignedUrl(key))
					.build();
		} catch (Exception e) {
			throw new AppException(ErrorCode.GENERATE_URL_FAILED);
		}
	}

}

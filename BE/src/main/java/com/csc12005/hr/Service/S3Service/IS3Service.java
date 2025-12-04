package com.csc12005.hr.Service.S3Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface IS3Service {
	String uploadFile(MultipartFile file);
	String generatePresignedUrl(String fileKey);
}

package com.csc12005.hr.Service.S3Service.Impl;

import com.csc12005.hr.Service.S3Service.IS3Service;
import lombok.RequiredArgsConstructor;
import org.apache.poi.sl.usermodel.ObjectMetaData;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service implements IS3Service {
	private final S3Client s3Client;
	private final S3Presigner s3Presigner;
	@Value("${aws.region}")
	private String region;

	@Value("${aws.s3.bucketName}")
	private String bucketName;

	@Override
	public String uploadFile(MultipartFile file, String folder) {
		try {
			String key = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
			String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
			PutObjectRequest putObjectRequest = PutObjectRequest.builder()
					.bucket(bucketName)
					.key(key)
					.acl(ObjectCannedACL.PRIVATE)
					.contentType(contentType)
					.build();
			s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
			return key;
		} catch (S3Exception e) {
			throw new RuntimeException("S3 upload failed: " + e.awsErrorDetails().errorMessage(), e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	@Override
	public String generatePresignedUrl(String fileKey) {
		GetObjectRequest getObjectRequest = GetObjectRequest.builder()
				.bucket(bucketName)
				.key(fileKey)
				.build();
		GetObjectPresignRequest getObjectPresignRequest = GetObjectPresignRequest.builder()
				.signatureDuration(java.time.Duration.ofMinutes(500))
				.getObjectRequest(getObjectRequest)
				.build();
		PresignedGetObjectRequest presignedGetObjectRequest = s3Presigner.presignGetObject(getObjectPresignRequest);
		return presignedGetObjectRequest.url().toString();
	}
}

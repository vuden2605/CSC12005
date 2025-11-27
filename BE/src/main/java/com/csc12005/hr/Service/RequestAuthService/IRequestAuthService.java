package com.csc12005.hr.Service.RequestAuthService;

import org.springframework.stereotype.Service;

@Service
public interface IRequestAuthService {
	boolean canApproveOrRejectRequest(Long requestId, String username);
}

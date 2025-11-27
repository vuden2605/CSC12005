package com.csc12005.hr.Service.ProjectAuthService;

import org.springframework.stereotype.Service;

@Service
public interface IProjectAuthService {
	boolean canCreateTask(Long projectId, String username);
}

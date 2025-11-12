package com.csc12005.hr.Service.DepartmentService;

import com.csc12005.hr.DTO.Request.DepartmentCreationRequest;
import com.csc12005.hr.DTO.Response.DepartmentResponse;

public interface IDepartmentService {
	DepartmentResponse createDepartment(DepartmentCreationRequest departmentCreationRequest);
}

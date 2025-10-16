package com.csc12005.hr.Service;

import com.csc12005.hr.DTO.Request.DepartmentCreationRequest;
import com.csc12005.hr.DTO.Response.DepartmentResponse;
import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Mapper.DepartmentMapper;
import com.csc12005.hr.Repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DepartmentService {
	private final DepartmentRepository departmentRepository;
	private final DepartmentMapper departmentMapper;
	public DepartmentResponse createDepartment(DepartmentCreationRequest departmentCreationRequest) {
		Department department = departmentMapper.toDepartment(departmentCreationRequest);
		return departmentMapper.toDepartmentResponse(departmentRepository.save(department));
	}
}

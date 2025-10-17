package com.csc12005.hr.Service;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Position;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.EmployeeMapper;
import com.csc12005.hr.Repository.DepartmentRepository;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class EmployeeService {
	private final EmployeeRepository employeeRepository;
	private final EmployeeMapper employeeMapper;
	private final DepartmentRepository departmentRepository;
	private final PositionRepository positionRepository;
	private String generateEmployeeCode(Department department, Position position) {
		// Generate employee code logic
		int year = LocalDate.now().getYear();
		long count = employeeRepository.countByYearAndDepartmentAndPosition(year, department.getDepartmentId(), position.getPositionId());
		long sequence = count + 1;
		String sequenceFormatted = String.format("%03d", sequence);
		return year + "-" + department.getDepartmentCode() + "-" + position.getPositionCode() + "-" + sequenceFormatted;
	}
	public EmployeeResponse createEmployee(EmployeeCreationRequest employeeCreationRequest) {
		if(employeeRepository.existsByEmail(employeeCreationRequest.getEmail())) {
			throw new RuntimeException("Email already exists");
		}
		Department department = departmentRepository.findById(employeeCreationRequest.getDepartmentId())
				.orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
		Position position = positionRepository.findById(employeeCreationRequest.getPositionId())
				.orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));
		Employee employee = employeeMapper.toEmployee(employeeCreationRequest);
		employee.setDepartment(department);
		employee.setPosition(position);
		employee.setEmployeeCode(generateEmployeeCode(employee.getDepartment(), employee.getPosition()));
		return employeeMapper.toEmployeeResponse(employeeRepository.save(employee));
	}

}

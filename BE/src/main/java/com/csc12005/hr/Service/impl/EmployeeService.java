package com.csc12005.hr.Service.impl;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Request.EmployeeUpdateRequest;
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
import com.csc12005.hr.Service.IEmployeeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService implements IEmployeeService {
	private final EmployeeRepository employeeRepository;
	private final EmployeeMapper employeeMapper;
	private final DepartmentRepository departmentRepository;
	private final PositionRepository positionRepository;
	private final PasswordEncoder passwordEncoder;
	private String generateEmployeeCode(Department department, Position position) {
		// Generate employee code logic
		int year = LocalDate.now().getYear();
		log.info("year: {}", year);
		long count = employeeRepository.countByYearAndDepartmentAndPosition(year, department.getDepartmentId(), position.getPositionId());
		log.info("count: {}", count);
		long sequence = count + 1;
		String sequenceFormatted = String.format("%03d", sequence);
		return year + "-" + department.getDepartmentCode() + "-" + position.getPositionCode() + "-" + sequenceFormatted;
	}
	public EmployeeResponse createEmployee(EmployeeCreationRequest employeeCreationRequest) {
		if(employeeRepository.existsByEmail(employeeCreationRequest.getEmail())) {
			throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
		}
		Department department = departmentRepository.findById(employeeCreationRequest.getDepartmentId())
				.orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
		Position position = positionRepository.findById(employeeCreationRequest.getPositionId())
				.orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));
		String employeeCode = generateEmployeeCode(department, position);
		Employee employee = employeeMapper.toEmployee(employeeCreationRequest);
		employee.setDepartment(department);
		employee.setPosition(position);
		employee.setEmployeeCode(employeeCode);
		employee.setPassword(passwordEncoder.encode(employeeCode));
		return employeeMapper.toEmployeeResponse(employeeRepository.save(employee));
	}
    public EmployeeResponse getMyInfo(){
        var context= SecurityContextHolder.getContext();
        String emloyeeCode= context.getAuthentication().getName();
        Employee employee=employeeRepository.findByEmployeeCode(emloyeeCode).orElseThrow(()-> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
        return employeeMapper.toEmployeeResponse(employee);
    }
    public EmployeeResponse updateUser(EmployeeUpdateRequest request){
        var context= SecurityContextHolder.getContext();
        String employeeCode= context.getAuthentication().getName();
        Employee employee= employeeRepository.findByEmployeeCode(employeeCode).orElseThrow(()->new AppException(ErrorCode.USERNAME_NOT_FOUND));
        if(request.getEmail()!=null) employee.setEmail(request.getEmail());
        if(request.getPhone()!=null) employee.setPhone(request.getPhone());
        if(request.getAddress()!=null) employee.setAddress(request.getAddress());
        employee=employeeRepository.save(employee);
        return employeeMapper.toEmployeeResponse(employee);
    }

}

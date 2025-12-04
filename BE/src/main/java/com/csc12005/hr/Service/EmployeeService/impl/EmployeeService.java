package com.csc12005.hr.Service.EmployeeService.impl;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Request.EmployeeHRUpdateRequest;
import com.csc12005.hr.DTO.Request.EmployeeUpdateRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
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
import com.csc12005.hr.Service.EmployeeService.IEmployeeService;
import com.csc12005.hr.Service.S3Service.Impl.S3Service;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.Manager;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService implements IEmployeeService {
	private final EmployeeRepository employeeRepository;
	private final EmployeeMapper employeeMapper;
	private final DepartmentRepository departmentRepository;
	private final PositionRepository positionRepository;
	private final PasswordEncoder passwordEncoder;
	private final S3Service s3Service;
	private String generateEmployeeCode(Department department, Position position) {
		// Generate employee code logic
		int year = LocalDate.now().getYear();
		log.info("year: {}", year);
		long count = employeeRepository.countByYearAndDepartmentAndPosition(year, department.getId(), position.getId());
		log.info("count: {}", count);
		long sequence = count + 1;
		String sequenceFormatted = String.format("%03d", sequence);
		return year + "-" + department.getDepartmentCode() + "_" + position.getPositionCode() + "_" + sequenceFormatted;
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
		// Set manager info
		Employee manager = department.getManager();
		if (manager != null) {
			employee.setManager(manager);
		}

		EmployeeResponse employeeResponse =
				employeeMapper.toEmployeeResponse(employeeRepository.save(employee));

		if (manager != null) {
			employeeResponse.setManagerName(manager.getFullName());
			employeeResponse.setManagerId(manager.getId());
			employeeResponse.setManagerCode(manager.getEmployeeCode());
		}
		return employeeResponse;
	}
    public EmployeeResponse getMyInfo(){
        var context= SecurityContextHolder.getContext();
        String employeeId= context.getAuthentication().getName();
        Employee employee=employeeRepository.findById(Long.parseLong(employeeId))
		        .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
        return employeeMapper.toEmployeeResponse(employee);
    }
    public EmployeeResponse updateUser(EmployeeUpdateRequest request){
        var context= SecurityContextHolder.getContext();
        String employeeId= context.getAuthentication().getName();
        Employee employee= employeeRepository.findById(Long.parseLong(employeeId))
                .orElseThrow(()->new AppException(ErrorCode.USERNAME_NOT_FOUND));
        if (request.getEmail()!=null) employee.setEmail(request.getEmail());
        if (request.getPhone()!=null) employee.setPhone(request.getPhone());
        if (request.getAddress()!=null) employee.setAddress(request.getAddress());
        if (request.getAvatar()!=null){
			try {
				String avatarUrl = s3Service.uploadFile(request.getAvatar());
				employee.setAvatarUrl(avatarUrl);
			} catch (Exception e) {
				throw new AppException(ErrorCode.FILE_PROCESSING_ERROR);
			}
		}
        employee = employeeRepository.save(employee);
        return employeeMapper.toEmployeeResponse(employee);
    }
    public EmployeeResponse hrUpdateEmployee(EmployeeHRUpdateRequest request, Long id){
        Employee employee= employeeRepository.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
        employeeMapper.updateEmployeeFromDto(request,employee);
        employee=employeeRepository.save(employee);
        return employeeMapper.toEmployeeResponse(employee);
    }
	public Page<EmployeeResponse> getEmployeesByDepartment(Long departmentId, PageRequestDTO pageRequestDTO) {
		Pageable pageable = pageRequestDTO.buildPageable();
		Department department = departmentRepository.findById(departmentId)
				.orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
		Page<Employee> employees = employeeRepository.findByDepartmentId(departmentId, pageable);
		return employees.map(employeeMapper::toEmployeeResponse);
	}
	public Page<EmployeeResponse> getEmployeesByManager(Long managerId, PageRequestDTO pageRequestDTO) {
		Pageable pageable = pageRequestDTO.buildPageable();
		Employee manager = employeeRepository.findById(managerId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		Page<Employee> employees = employeeRepository.findByManagerId(managerId, pageable);
		return employees.map(employeeMapper::toEmployeeResponse);
	}
}

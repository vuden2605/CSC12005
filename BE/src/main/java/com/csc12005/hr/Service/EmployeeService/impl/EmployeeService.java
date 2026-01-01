package com.csc12005.hr.Service.EmployeeService.impl;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Request.EmployeeHRUpdateRequest;
import com.csc12005.hr.DTO.Request.EmployeeUpdateRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.ImportError;
import com.csc12005.hr.DTO.Response.ImportResult;
import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Position;
import com.csc12005.hr.Enums.EducationLevel;
import com.csc12005.hr.Enums.MaritalStatus;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Mapper.EmployeeMapper;
import com.csc12005.hr.Repository.DepartmentRepository;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.PositionRepository;
import com.csc12005.hr.Service.EmployeeService.IEmployeeService;
import com.csc12005.hr.Service.S3Service.Impl.S3Service;
import com.csc12005.hr.Utils.ExcelUtils;
import com.csc12005.hr.Utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
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
	private final SecurityUtils securityUtils;

	private String generateEmployeeCode(Department department) {
		// Generate employee code logic
		int year = LocalDate.now().getYear();
		log.info("year: {}", year);
		long count = employeeRepository.countByYearAndDepartmentAndPosition(year, department.getId());
		log.info("count: {}", count);
		long sequence = count + 1;
		String sequenceFormatted = String.format("%03d", sequence);
		return year + "_" + department.getDepartmentCode() + "_" + sequenceFormatted;
	}

	public EmployeeResponse createEmployee(EmployeeCreationRequest employeeCreationRequest) {
		if (employeeRepository.existsByEmail(employeeCreationRequest.getEmail())) {
			throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
		}
		Department department = departmentRepository.findById(employeeCreationRequest.getDepartmentId())
				.orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
		Position position = positionRepository.findById(employeeCreationRequest.getPositionId())
				.orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));
		String employeeCode = generateEmployeeCode(department);
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
	@Cacheable(value = "employeeCache", key ="#userId")
	public EmployeeResponse getMyInfo(Long userId) {
		Employee employee = employeeRepository.findById(userId)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		return employeeMapper.toEmployeeResponse(employee);
	}
	@CachePut(value = "employeeCache", key = "#userId")
	public EmployeeResponse updateUser(EmployeeUpdateRequest request, Long userId) {
		Employee employee = employeeRepository.findById(userId)
				.orElseThrow(() -> new AppException(ErrorCode.USERNAME_NOT_FOUND));
		if (request.getEmail() != null) employee.setEmail(request.getEmail());
		if (request.getPhone() != null) employee.setPhone(request.getPhone());
		if (request.getAddress() != null) employee.setAddress(request.getAddress());
		if (request.getAvatar() != null) {
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
	@CachePut(value = "employeeCache", key = "#id")
	public EmployeeResponse hrUpdateEmployee(EmployeeHRUpdateRequest request, Long id) {
		// Tìm employee
		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

		// Update basic fields
		employeeMapper.updateEmployeeFromDto(request, employee);

		// Update department nếu có
		if (request.getDepartmentId() != null) {
			Department department = departmentRepository.findById(request.getDepartmentId())
					.orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
			employee.setDepartment(department);

			// Optional: Update manager nếu đổi department
			Employee manager = department.getManager();
			if (manager != null) {
				employee.setManager(manager);
			}
		}

		// Update position nếu có
		if (request.getPositionId() != null) {
			Position position = positionRepository.findById(request.getPositionId())
					.orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));
			employee.setPosition(position);
		}

		// Save và return với department & position đầy đủ
		employee = employeeRepository.save(employee);
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

	public List<EmployeeResponse> getAll() {
		List<Employee> employeeList = employeeRepository.findAll();
		return employeeList.stream().map(employeeMapper::toEmployeeResponse).toList();
	}

	public EmployeeResponse updateStatus(Long id) {
		Employee employee = employeeRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
		employee.setStatus(!employee.getStatus());

		employeeRepository.save(employee);
		return employeeMapper.toEmployeeResponse(employee);
	}
	public ImportResult importExcel(MultipartFile file) {
		int successCount = 0;
		List<ImportError> importErrors = new ArrayList<>();
		List<Employee> employees = new ArrayList<>();

		try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

			Sheet sheet = workbook.getSheetAt(0);

			for (int i = 1; i <= sheet.getLastRowNum(); i++) {
				Row row = sheet.getRow(i);
				if (row == null) continue;

				String departmentCode = ExcelUtils.getString(row.getCell(16));
				if (departmentCode == null || departmentCode.isEmpty()) continue;

				try {

					Department department = departmentRepository
							.findByDepartmentCode(ExcelUtils.getString(row.getCell(16)))
							.orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

					Position position = positionRepository
							.findByPositionCode(ExcelUtils.getString(row.getCell(17)))
							.orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));

					String employeeCode = generateEmployeeCode(department);

					String email = ExcelUtils.getString(row.getCell(1));
					if(employeeRepository.existsByEmail(email)) {
						throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
					}

					Employee employee = Employee.builder()
							.fullName(ExcelUtils.getString(row.getCell(0)))
							.email(email)
							.phone(ExcelUtils.getString(row.getCell(2)))
							.address(ExcelUtils.getString(row.getCell(3)))
							.birthDate(ExcelUtils.getLocalDate(row.getCell(4)))
							.nationalCode(ExcelUtils.getString(row.getCell(5)))
							.taxCode(ExcelUtils.getString(row.getCell(6)))
							.bankName(ExcelUtils.getString(row.getCell(7)))
							.bankAccount(ExcelUtils.getString(row.getCell(8)))
							.baseSalary(ExcelUtils.getLong(row.getCell(9)))
							.permanentAddress(ExcelUtils.getString(row.getCell(10)))
							.maritalStatus(MaritalStatus.valueOf(ExcelUtils.getString(row.getCell(11))))
							.educationLevel(EducationLevel.valueOf(ExcelUtils.getString(row.getCell(12))))
							.major(ExcelUtils.getString(row.getCell(13)))
							.university(ExcelUtils.getString(row.getCell(14)))
							.gender(ExcelUtils.getString(row.getCell(15)))
							.employeeCode(employeeCode)
							.department(department)
							.position(position)
							.password(passwordEncoder.encode(employeeCode))
							.build();
					employees.add(employee);
					successCount++;

				} catch (Exception ex) {
					importErrors.add(
							ImportError.builder()
									.code(ErrorCode.IMPORT_EMPLOYEE_FAIL.getCode())
									.message("Dòng " + (i + 1) + ": " + ex.getMessage())
									.build()
					);
				}
			}

		} catch (Exception e) {
			throw new AppException(ErrorCode.FILE_INVALID_FORMAT);
		}

		if (!employees.isEmpty()) {
			employeeRepository.saveAll(employees);
		}

		return ImportResult.builder()
				.successRow(successCount)
				.importErrors(importErrors)
				.isSuccess(true)
				.build();
	}
	@CacheEvict(value = "employeeCache", key = "#id")
	public void deleteEmployee(Long id) {
		employeeRepository.deleteById(id);
	}

}


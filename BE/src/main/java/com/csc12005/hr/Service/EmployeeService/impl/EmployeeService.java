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
import com.csc12005.hr.Enums.ContractType;
import com.csc12005.hr.Enums.EducationLevel;
import com.csc12005.hr.Enums.MaritalStatus;
import com.csc12005.hr.Enums.WorkSchedule;
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
import jakarta.validation.Validator;
import jakarta.validation.ConstraintViolation;

import java.math.BigDecimal;
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
	private final Validator validator;

	private String generateEmployeeCode(Department department) {
		long count = employeeRepository.countByDepartment(department.getId());
		log.info("count: {}", count);
		long sequence = count + 1;
		String sequenceFormatted = String.format("%03d", sequence);
		return department.getDepartmentCode() + "_" + sequenceFormatted;
	}

	private Department getDepartmentOrThrow(Long departmentId) {
		return departmentRepository.findById(departmentId)
				.orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
	}

	private Position getPositionOrThrow(Long positionId) {
		return positionRepository.findById(positionId)
				.orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));
	}

	private void validateNewEmployeeBusiness(EmployeeCreationRequest dto) {
		if (employeeRepository.existsByEmail(dto.getEmail())) {
			throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
		}

		if (dto.getDepartmentId() == null || !departmentRepository.existsById(dto.getDepartmentId())) {
			throw new AppException(ErrorCode.DEPARTMENT_NOT_FOUND);
		}
		if (dto.getPositionId() == null || !positionRepository.existsById(dto.getPositionId())) {
			throw new AppException(ErrorCode.POSITION_NOT_FOUND);
		}
	}
	private void validateEmployeeCreationRequest(EmployeeCreationRequest dto) {
		var violations = validator.validate(dto);
		if (!violations.isEmpty()) {
			log.info("Validation errors: {}", violations);
			String errorKey = violations.iterator().next().getMessage();
			ErrorCode errorCode;
			try {
				errorCode = ErrorCode.valueOf(errorKey);
			} catch (IllegalArgumentException ex) {
				errorCode = ErrorCode.INVALID_INPUT;
			}
			throw new AppException(errorCode);
		}
		validateNewEmployeeBusiness(dto);
	}
	private Employee buildEmployeeFromCreationRequest(EmployeeCreationRequest dto,
	                                                  Department department,
	                                                  Position position) {
		Employee employee = employeeMapper.toEmployee(dto);
		employee.setDepartment(department);
		employee.setPosition(position);

		String employeeCode = generateEmployeeCode(department);
		employee.setEmployeeCode(employeeCode);
		employee.setPassword(passwordEncoder.encode(employeeCode));

		Employee manager = department.getManager();
		if (manager != null) {
			employee.setManager(manager);
		}

		return employee;
	}

	public EmployeeResponse createEmployee(EmployeeCreationRequest employeeCreationRequest) {
		validateNewEmployeeBusiness(employeeCreationRequest);
		Department department = getDepartmentOrThrow(employeeCreationRequest.getDepartmentId());
		Position position = getPositionOrThrow(employeeCreationRequest.getPositionId());
		Employee employee = buildEmployeeFromCreationRequest(employeeCreationRequest, department, position);
		return employeeMapper.toEmployeeResponse(employeeRepository.save(employee));
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
			employee.setEmployeeCode(generateEmployeeCode(department));
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
		Long currentUserId = securityUtils.getCurrentUserId();

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
					EmployeeCreationRequest dto = buildCreationRequestFromRow(row, department, position);
					validateEmployeeCreationRequest(dto);
					Employee employee = buildEmployeeFromCreationRequest(dto, department, position);
					employee.setCreatedBy(employeeRepository.getReferenceById(currentUserId));
					employee.setUpdatedBy(employeeRepository.getReferenceById(currentUserId));
					employees.add(employee);
					successCount++;
				} catch (Exception ex) {
					importErrors.add(
							ImportError.builder()
									.code(ErrorCode.IMPORT_EMPLOYEE_FAIL.getCode())
									.message("Dòng " + i + ": " + ex.getMessage())
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
	private EmployeeCreationRequest buildCreationRequestFromRow(Row row, Department department, Position position) {
		EmployeeCreationRequest dto = new EmployeeCreationRequest();

		dto.setFullName(ExcelUtils.getString(row.getCell(0)));
		dto.setEmail(ExcelUtils.getString(row.getCell(1)));
		dto.setPhone(ExcelUtils.getString(row.getCell(2)));
		dto.setAddress(ExcelUtils.getString(row.getCell(3)));
		dto.setBirthDate(ExcelUtils.getLocalDate(row.getCell(4)));
		dto.setNationalCode(ExcelUtils.getString(row.getCell(5)));
		dto.setTaxCode(ExcelUtils.getString(row.getCell(6)));
		dto.setBankName(ExcelUtils.getString(row.getCell(7)));
		dto.setBankAccount(ExcelUtils.getString(row.getCell(8)));
		Long baseSalaryValue = ExcelUtils.getLong(row.getCell(9));
		BigDecimal baseSalary = baseSalaryValue != null
				? BigDecimal.valueOf(baseSalaryValue)
				: BigDecimal.ZERO;
		dto.setBaseSalary(baseSalary);
		dto.setPermanentAddress(ExcelUtils.getString(row.getCell(10)));
		dto.setMaritalStatus(MaritalStatus.valueOf(ExcelUtils.getString(row.getCell(11))));
		dto.setEducationLevel(EducationLevel.valueOf(ExcelUtils.getString(row.getCell(12))));
		dto.setMajor(ExcelUtils.getString(row.getCell(13)));
		dto.setUniversity(ExcelUtils.getString(row.getCell(14)));
		dto.setGender(ExcelUtils.getString(row.getCell(15)));
		dto.setHireDate(ExcelUtils.getLocalDate(row.getCell(18)));
		dto.setDegree(ExcelUtils.getString(row.getCell(19)));
		Long graduationYearValue = ExcelUtils.getLong(row.getCell(20));
		if (graduationYearValue != null) {
			dto.setGraduationYear(graduationYearValue.intValue());
		}
		dto.setNationality(ExcelUtils.getString(row.getCell(21)));
		dto.setPlaceOfBirth(ExcelUtils.getString(row.getCell(22)));
		dto.setReligion(ExcelUtils.getString(row.getCell(23)));
		dto.setEmergencyContactName(ExcelUtils.getString(row.getCell(24)));
		dto.setEmergencyContactPhone(ExcelUtils.getString(row.getCell(25)));
		dto.setEmergencyContactRelationship(ExcelUtils.getString(row.getCell(26)));
		dto.setContractStartDate(ExcelUtils.getLocalDate(row.getCell(27)));
		dto.setContractEndDate(ExcelUtils.getLocalDate(row.getCell(28)));
		dto.setContractType(ContractType.valueOf(ExcelUtils.getString(row.getCell(29))));
		dto.setWorkSchedule(WorkSchedule.valueOf(ExcelUtils.getString(row.getCell(30))));
		dto.setBankBranch(ExcelUtils.getString(row.getCell(31)));

		dto.setDepartmentId(department.getId());
		dto.setPositionId(position.getId());

		return dto;
	}
	@CacheEvict(value = "employeeCache", key = "#id")
	public void deleteEmployee(Long id) {
		employeeRepository.deleteById(id);
	}

}


package com.csc12005.hr.Configure;

import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity. Employee;
import com.csc12005.hr.Entity.Position;
import com.csc12005.hr. Enums.EmployeeRole;
import com.csc12005.hr.Repository.DepartmentRepository;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j. Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApplicationInitConfig implements CommandLineRunner {

	// ==================== CONSTANTS ====================
	@Value("${app.password-default}")
	private String DEFAULT_PASSWORD;
	private static final String ADMIN_CODE = "admin";
	private static final String CEO_CODE = "CEO";
	private static final String ADMIN_EMAIL = "admin@company.com";
	private static final String CEO_EMAIL = "ceo@company.com";
	private static final String COMPANY_EMAIL_DOMAIN = "@company. com";

	// ==================== DEPENDENCIES ====================
	private final EmployeeRepository employeeRepository;
	private final PasswordEncoder passwordEncoder;
	private final DepartmentRepository departmentRepository;
	private final PositionRepository positionRepository;

	// ==================== MAIN RUNNER ====================
	@Override
	@Transactional
	public void run(String... args) throws Exception {
		log.info("========== Starting Application Initialization ==========");

		// Check if data already exists
		if (departmentRepository.count() > 0 && employeeRepository.count() > 0) {
			log.info("Data already initialized.  Skipping initialization...");
			return;
		}

		try {
			createDefaultDepartmentAndPosition();
			log.info("✓ Created {} departments with positions", departmentRepository.count());

			createDefaultUser();
			log.info("✓ Created default admin and CEO users");

			createDepartmentManagers();
			log.info("✓ Created department managers");

			log.info("========== Application Initialization Completed Successfully ==========");
		} catch (Exception e) {
			log.error("❌ Error during application initialization", e);
			throw e;
		}
	}

	// ==================== CREATE DEFAULT USERS (ADMIN & CEO) ====================
	private void createDefaultUser() {
		// Create Administration Department for Admin & CEO
		Department adminDept = Department.builder()
				.departmentName("Administration")
				.departmentCode("ADM")
				.build();
		adminDept = departmentRepository.save(adminDept);

		// ---------- ADMIN POSITION & USER ------------
		Position adminPosition = Position. builder()
				.positionName("Administrator")
				.positionCode("ADM")
				.salaryRangeMin(18000000L)
				.salaryRangeMax(30000000L)
				.baseWorkTimes(8L)
				.point(100L)
				.role(EmployeeRole.ADMIN)
				.department(adminDept)
				.build();
		adminPosition = positionRepository.save(adminPosition);

		if (! employeeRepository.existsByEmployeeCode(ADMIN_CODE)) {
			Employee admin = Employee.builder()
					.employeeCode(ADMIN_CODE)
					.fullName("System Administrator")
					.email(ADMIN_EMAIL)
					.password(passwordEncoder.encode(DEFAULT_PASSWORD))
					.position(adminPosition)
					.department(adminDept)
					.baseSalary(BigDecimal. valueOf(25000000))  // BigDecimal
					.build();
			employeeRepository.save(admin);
			log.info("Created admin user: {}", ADMIN_CODE);
		}

		// ---------- CEO POSITION & USER ------------
		Position ceoPosition = Position.builder()
				.positionName("Chief Executive Officer")
				.positionCode("CEO")
				.salaryRangeMin(40000000L)
				.salaryRangeMax(80000000L)
				.baseWorkTimes(8L)
				.point(150L)
				.role(EmployeeRole.CEO)
				.department(adminDept)
				.build();
		ceoPosition = positionRepository.save(ceoPosition);

		if (!employeeRepository.existsByEmployeeCode(CEO_CODE)) {
			Employee ceo = Employee.builder()
					.employeeCode(CEO_CODE)
					.fullName("Chief Executive Officer")
					.email(CEO_EMAIL)
					.password(passwordEncoder.encode(DEFAULT_PASSWORD))
					.position(ceoPosition)
					.department(adminDept)
					.baseSalary(BigDecimal.valueOf(60000000))  // BigDecimal
					.build();
			employeeRepository.save(ceo);
			log.info("Created CEO user: {}", CEO_CODE);
		}

		// Link positions to department
		adminDept.getPositions().add(adminPosition);
		adminDept.getPositions().add(ceoPosition);
		departmentRepository.save(adminDept);
	}

	// ==================== HELPER METHOD ====================
	private void link(Department d, Position p) {
		d.getPositions().add(p);
		p.setDepartment(d);
	}

	// ==================== CREATE DEPARTMENTS & POSITIONS ====================
	public void createDefaultDepartmentAndPosition() {

		// ======================= CREATE DEPARTMENTS ===========================
		Department hr = Department.builder()
				.departmentName("Human Resources")
				.departmentCode("HR")
				.build();

		Department finance = Department.builder()
				.departmentName("Finance")
				.departmentCode("FIN")
				.build();

		Department it = Department.builder()
				.departmentName("Information Technology")
				.departmentCode("IT")
				.build();

		Department sales = Department.builder()
				.departmentName("Sales")
				.departmentCode("SAL")
				.build();

		Department marketing = Department.builder()
				.departmentName("Marketing")
				.departmentCode("MKT")
				.build();

		Department manufacturing = Department.builder()
				.departmentName("Manufacturing")
				.departmentCode("MFG")
				.build();

		// ======================= CREATE POSITIONS ===========================
		Position p;

		// ---------- HR ------------
		p = Position.builder().positionName("HR Manager").positionCode("HR-MAN")
				.salaryRangeMin(15000000L).salaryRangeMax(30000000L)
				.baseWorkTimes(8L).point(100L).role(EmployeeRole.HRM).build();
		link(hr, p);

		p = Position.builder().positionName("HR Executive").positionCode("HR-EXE")
				.salaryRangeMin(10000000L).salaryRangeMax(20000000L)
				.baseWorkTimes(8L).point(70L).role(EmployeeRole.HR).build();
		link(hr, p);

		p = Position.builder().positionName("Recruiter").positionCode("HR-REC")
				.salaryRangeMin(9000000L).salaryRangeMax(18000000L)
				.baseWorkTimes(8L).point(60L).role(EmployeeRole.HR).build();
		link(hr, p);

		p = Position.builder().positionName("HR Business Partner").positionCode("HR-BP")
				.salaryRangeMin(12000000L).salaryRangeMax(23000000L)
				.baseWorkTimes(8L).point(80L).role(EmployeeRole.HR).build();
		link(hr, p);

		p = Position.builder().positionName("C&B Specialist").positionCode("HR-CB")
				.salaryRangeMin(9000000L).salaryRangeMax(17000000L)
				.baseWorkTimes(8L).point(60L).role(EmployeeRole.HR).build();
		link(hr, p);

		p = Position.builder().positionName("Training Specialist").positionCode("HR-TRN")
				.salaryRangeMin(8000000L).salaryRangeMax(16000000L)
				.baseWorkTimes(8L).point(55L).role(EmployeeRole.HR).build();
		link(hr, p);

		// ---------- FINANCE ------------
		p = Position.builder().positionName("Finance Manager").positionCode("FIN-MAN")
				.salaryRangeMin(25000000L).salaryRangeMax(45000000L)
				.baseWorkTimes(8L).point(120L).role(EmployeeRole.MN).build();
		link(finance, p);

		p = Position.builder().positionName("Accountant").positionCode("FIN-ACC")
				.salaryRangeMin(10000000L).salaryRangeMax(20000000L)
				.baseWorkTimes(8L).point(70L).role(EmployeeRole.EMP).build();
		link(finance, p);

		p = Position.builder().positionName("Payroll Specialist").positionCode("FIN-PAY")
				.salaryRangeMin(9000000L).salaryRangeMax(17000000L)
				.baseWorkTimes(8L).point(60L).role(EmployeeRole.EMP).build();
		link(finance, p);

		p = Position.builder().positionName("Financial Analyst").positionCode("FIN-ANA")
				.salaryRangeMin(12000000L).salaryRangeMax(25000000L)
				.baseWorkTimes(8L).point(85L).role(EmployeeRole.EMP).build();
		link(finance, p);

		// ---------- IT ------------
		p = Position.builder().positionName("IT Manager").positionCode("IT-MAN")
				.salaryRangeMin(25000000L).salaryRangeMax(45000000L)
				.baseWorkTimes(8L).point(120L).role(EmployeeRole.MN).build();
		link(it, p);

		p = Position.builder().positionName("Developer").positionCode("IT-DEV")
				.salaryRangeMin(12000000L).salaryRangeMax(25000000L)
				.baseWorkTimes(8L).point(80L).role(EmployeeRole.EMP).build();
		link(it, p);

		p = Position.builder().positionName("QA/QC").positionCode("IT-QA")
				.salaryRangeMin(10000000L).salaryRangeMax(20000000L)
				.baseWorkTimes(8L).point(70L).role(EmployeeRole.EMP).build();
		link(it, p);

		p = Position.builder().positionName("Network Engineer").positionCode("IT-NET")
				.salaryRangeMin(13000000L).salaryRangeMax(23000000L)
				.baseWorkTimes(8L).point(75L).role(EmployeeRole.EMP).build();
		link(it, p);

		// ---------- SALES ------------
		p = Position.builder().positionName("Sales Manager").positionCode("SAL-MAN")
				.salaryRangeMin(20000000L).salaryRangeMax(40000000L)
				.baseWorkTimes(8L).point(110L).role(EmployeeRole.MN).build();
		link(sales, p);

		p = Position.builder().positionName("Sales Executive").positionCode("SAL-EXE")
				.salaryRangeMin(8000000L).salaryRangeMax(20000000L)
				.baseWorkTimes(8L).point(60L).role(EmployeeRole.EMP).build();
		link(sales, p);

		p = Position.builder().positionName("Account Manager").positionCode("SAL-ACC")
				.salaryRangeMin(12000000L).salaryRangeMax(25000000L)
				.baseWorkTimes(8L).point(85L).role(EmployeeRole.EMP).build();
		link(sales, p);

		// ---------- MARKETING ------------
		p = Position.builder().positionName("Marketing Manager").positionCode("MKT-MAN")
				.salaryRangeMin(20000000L).salaryRangeMax(40000000L)
				.baseWorkTimes(8L).point(110L).role(EmployeeRole.MN).build();
		link(marketing, p);

		p = Position.builder().positionName("Content Creator").positionCode("MKT-CON")
				.salaryRangeMin(8000000L).salaryRangeMax(16000000L)
				.baseWorkTimes(8L).point(50L).role(EmployeeRole.EMP).build();
		link(marketing, p);

		p = Position.builder().positionName("SEO Specialist").positionCode("MKT-SEO")
				.salaryRangeMin(9000000L).salaryRangeMax(18000000L)
				.baseWorkTimes(8L).point(60L).role(EmployeeRole.EMP).build();
		link(marketing, p);

		p = Position.builder().positionName("Graphic Designer").positionCode("MKT-DES")
				.salaryRangeMin(9000000L).salaryRangeMax(17000000L)
				.baseWorkTimes(8L).point(55L).role(EmployeeRole.EMP).build();
		link(marketing, p);

		// ---------- MANUFACTURING ------------
		p = Position.builder().positionName("Operation Manager").positionCode("MFG-MAN")
				.salaryRangeMin(20000000L).salaryRangeMax(35000000L)
				.baseWorkTimes(8L).point(110L).role(EmployeeRole.MN).build();
		link(manufacturing, p);

		p = Position.builder().positionName("Supervisor").positionCode("MFG-SUP")
				.salaryRangeMin(12000000L).salaryRangeMax(22000000L)
				.baseWorkTimes(8L).point(70L).role(EmployeeRole.EMP).build();
		link(manufacturing, p);

		p = Position.builder().positionName("Worker").positionCode("MFG-WRK")
				.salaryRangeMin(6000000L).salaryRangeMax(12000000L)
				.baseWorkTimes(8L).point(30L).role(EmployeeRole.EMP).build();
		link(manufacturing, p);

		p = Position.builder().positionName("QC/QA Staff").positionCode("MFG-QA")
				.salaryRangeMin(8000000L).salaryRangeMax(16000000L)
				.baseWorkTimes(8L).point(50L).role(EmployeeRole.EMP).build();
		link(manufacturing, p);

		// Save all departments (cascade will save positions)
		departmentRepository.saveAll(
				Arrays.asList(hr, finance, it, sales, marketing, manufacturing)
		);

		log.info("Created departments: HR, Finance, IT, Sales, Marketing, Manufacturing");
	}

	// ==================== CREATE DEPARTMENT MANAGERS ====================
	@Transactional
	private void createDepartmentManagers() {
		Employee ceo = employeeRepository.findByEmployeeCode(CEO_CODE)
				.orElseThrow(() -> new RuntimeException("CEO user not found.  Cannot create department managers."));

		// Get all departments except Administration
		List<Department> departments = departmentRepository.findAll().stream()
				.filter(dept -> !"ADM".equals(dept.getDepartmentCode()))
				.toList();

		for (Department department : departments) {
			// Skip if already has manager
			if (department.getManager() != null) {
				log.info("Department {} already has a manager, skipping...", department.getDepartmentCode());
				continue;
			}

			// Get positions for this department
			List<Position> positions = department.getPositions();
			if (positions.isEmpty()) {
				log.warn("No positions found for department: {}, skipping manager creation", department.getDepartmentCode());
				continue;
			}

			// Find manager position (role = MN or HRM)
			Position managerPosition = positions.stream()
					.filter(pos -> pos.getRole() == EmployeeRole.MN || pos.getRole() == EmployeeRole.HRM)
					.findFirst()
					.orElse(positions.get(0)); // Fallback to first position

			// Create manager employee
			String code = department.getDepartmentCode() + "-HEAD";
			String fullName = department.getDepartmentName() + " Manager";
			String email = code. toLowerCase() + COMPANY_EMAIL_DOMAIN;

			// Calculate base salary (middle of the range) using BigDecimal
			BigDecimal minSalary = BigDecimal.valueOf(managerPosition.getSalaryRangeMin());
			BigDecimal maxSalary = BigDecimal.valueOf(managerPosition.getSalaryRangeMax());
			BigDecimal baseSalary = minSalary.add(maxSalary)
					.divide(BigDecimal.valueOf(2), RoundingMode.HALF_UP);

			Employee manager = Employee. builder()
					.employeeCode(code)
					.fullName(fullName)
					.email(email)
					.password(passwordEncoder.encode(DEFAULT_PASSWORD))
					.department(department)
					.position(managerPosition)
					.manager(ceo)
					.baseSalary(baseSalary)
					.build();

			department.setManager(manager);
			employeeRepository. save(manager);
			departmentRepository.save(department);

			log.info("Created manager {} for department {} with salary {}", code, department.getDepartmentCode(), baseSalary);
		}
	}
}
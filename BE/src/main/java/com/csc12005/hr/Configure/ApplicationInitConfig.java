package com.csc12005.hr.Configure;

import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Position;
import com.csc12005.hr.Enums.EmployeeRole;
import com.csc12005.hr.Repository.DepartmentRepository;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApplicationInitConfig implements CommandLineRunner {
	private final EmployeeRepository employeeRepository;
	private final PasswordEncoder passwordEncoder;
	private final DepartmentRepository departmentRepository;
	private final PositionRepository positionRepository;
	@Override
	@Transactional
	public void run(String... args) throws Exception {
		createDefaultDepartmentAndPosition();
		createDefaultUser();
		createDepartmentManagers();
	}
	private void createDefaultUser() {
		// ---------- ADMIN ------------
		List<Position> positions = new ArrayList<>();
		positions.add(Position.builder().positionName("Admin").positionCode("ADM")
				.salaryRangeMin(18000000L).salaryRangeMax(30000000L)
				.baseWorkTimes(8L).point(100L).role(EmployeeRole.ADMIN).build());
		// CEO
		positions.add(Position.builder().positionName("CEO").positionCode("CEO")
				.salaryRangeMin(18000000L).salaryRangeMax(30000000L)
				.baseWorkTimes(8L).point(100L).role(EmployeeRole.CEO).build());
		positionRepository.saveAll(positions);
		if(!employeeRepository.existsByEmployeeCode("admin")) {
			Employee admin = Employee.builder()
					.employeeCode("admin")
					.fullName("Administrator")
					.email("vuden2605@gmail.com")
					.password(passwordEncoder.encode("admin"))
					.position(positions.getFirst())
					.build();
			employeeRepository.save(admin);
		}
		if (!employeeRepository.existsByEmployeeCode("CEO")) {
			Employee user = Employee.builder()
					.employeeCode("CEO")
					.fullName("Chief Executive Officer")
					.email("vuden2605@gmail.com")
					.password(passwordEncoder.encode("CEO"))
					.position(positions.get(1))
					.build();
			employeeRepository.save(user);
		}
	}
	private void link(Department d, Position p) {
		d.getPositions().add(p);
		p.setDepartment(d);
	}
	public void createDefaultDepartmentAndPosition() {

		if (departmentRepository.count() > 0 || positionRepository.count() > 0) {
			return;
		}

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

		// Lưu tất cả department — cascade = ALL sẽ tự lưu positions
		departmentRepository.saveAll(
				Arrays.asList(hr, finance, it, sales, marketing, manufacturing)
		);
	}
	@Transactional
	private void createDepartmentManagers() {
		// Lấy tất cả phòng ban
		List<Department> departments = departmentRepository.findAll();

		for (Department department : departments) {
			if (department.getManager() != null) {
				continue;
			}
			// Tạo trưởng phòng
			String code = department.getDepartmentCode() + "-HEAD"; // ví dụ HR-HEAD, FIN-HEAD
			String fullName = department.getDepartmentName() + " Manager";
			List<Position> positions = department.getPositions();
			Employee manager = Employee.builder()
					.employeeCode(code)
					.fullName(fullName)
					.email(code.toLowerCase() + "@company.com")
					.password(passwordEncoder.encode("123456"))
					.department(department)
					.position(positions.getFirst())
					.build();
			department.setManager(manager);
			employeeRepository.save(manager);
			departmentRepository.save(department);
		}
	}

}

package com.csc12005.hr.Configure;

import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Position;
import com.csc12005.hr.Enums.EmployeeRole;
import com.csc12005.hr.Repository.DepartmentRepository;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ApplicationInitConfig implements CommandLineRunner {
	private final EmployeeRepository employeeRepository;
	private final PasswordEncoder passwordEncoder;
	private final DepartmentRepository departmentRepository;
	private final PositionRepository positionRepository;
	@Override
	@Transactional
	public void run(String... args) throws Exception {
		createDefaultUser();
		createDefaultDepartmentAndPosition();
		createDepartmentManagers();
	}
	private void createDefaultUser() {
		if(employeeRepository.existsByEmployeeCode("admin")) {
			Employee admin = Employee.builder()
					.employeeCode("admin")
					.fullName("Administrator")
					.email("vuden2605@gmail.com")
					.password(passwordEncoder.encode("admin"))
					.role(EmployeeRole.ADMIN)
					.build();
			employeeRepository.save(admin);
		}
		if (employeeRepository.existsByEmployeeCode("CEO")) {
			Employee user = Employee.builder()
					.employeeCode("CEO")
					.fullName("Chief Executive Officer")
					.email("vuden2605@gmail.com")
					.password(passwordEncoder.encode("CEO"))
					.role(EmployeeRole.CEO)
					.build();
			employeeRepository.save(user);
		}
	}
	public void createDefaultDepartmentAndPosition() {

		if (departmentRepository.count() > 0 || positionRepository.count() > 0) {
			return;
		}

		// ======================= CREATE DEPARTMENTS ===========================
		Department hr = departmentRepository.save(
				Department.builder().departmentName("Human Resources").departmentCode("HR").build()
		);

		Department finance = departmentRepository.save(
				Department.builder().departmentName("Finance").departmentCode("FIN").build()
		);

		Department admin = departmentRepository.save(
				Department.builder().departmentName("Administration").departmentCode("ADM").build()
		);

		Department it = departmentRepository.save(
				Department.builder().departmentName("Information Technology").departmentCode("IT").build()
		);

		Department sales = departmentRepository.save(
				Department.builder().departmentName("Sales").departmentCode("SAL").build()
		);

		Department marketing = departmentRepository.save(
				Department.builder().departmentName("Marketing").departmentCode("MKT").build()
		);

		Department manufacturing = departmentRepository.save(
				Department.builder().departmentName("Manufacturing").departmentCode("MFG").build()
		);

		// ======================= CREATE POSITIONS ===========================
		List<Position> positions = new ArrayList<>();

		// ---------- HR ------------
		positions.add(Position.builder().positionName("HR Manager").positionCode("HR-MAN")
				.salaryRangeMin(15000000L).salaryRangeMax(30000000L)
				.baseWorkTimes(8L).point(100L).department(hr).build());

		positions.add(Position.builder().positionName("HR Executive").positionCode("HR-EXE")
				.salaryRangeMin(10000000L).salaryRangeMax(20000000L)
				.baseWorkTimes(8L).point(70L).department(hr).build());

		positions.add(Position.builder().positionName("Recruiter").positionCode("HR-REC")
				.salaryRangeMin(9000000L).salaryRangeMax(18000000L)
				.baseWorkTimes(8L).point(60L).department(hr).build());

		positions.add(Position.builder().positionName("HR Business Partner").positionCode("HR-BP")
				.salaryRangeMin(12000000L).salaryRangeMax(23000000L)
				.baseWorkTimes(8L).point(80L).department(hr).build());

		positions.add(Position.builder().positionName("C&B Specialist").positionCode("HR-CB")
				.salaryRangeMin(9000000L).salaryRangeMax(17000000L)
				.baseWorkTimes(8L).point(60L).department(hr).build());

		positions.add(Position.builder().positionName("Training Specialist").positionCode("HR-TRN")
				.salaryRangeMin(8000000L).salaryRangeMax(16000000L)
				.baseWorkTimes(8L).point(55L).department(hr).build());


		// ---------- FINANCE ------------
		positions.add(Position.builder().positionName("CFO").positionCode("FIN-CFO")
				.salaryRangeMin(50000000L).salaryRangeMax(90000000L)
				.baseWorkTimes(8L).point(200L).department(finance).build());

		positions.add(Position.builder().positionName("Finance Manager").positionCode("FIN-MAN")
				.salaryRangeMin(25000000L).salaryRangeMax(45000000L)
				.baseWorkTimes(8L).point(120L).department(finance).build());

		positions.add(Position.builder().positionName("Accountant").positionCode("FIN-ACC")
				.salaryRangeMin(10000000L).salaryRangeMax(20000000L)
				.baseWorkTimes(8L).point(70L).department(finance).build());

		positions.add(Position.builder().positionName("Payroll Specialist").positionCode("FIN-PAY")
				.salaryRangeMin(9000000L).salaryRangeMax(17000000L)
				.baseWorkTimes(8L).point(60L).department(finance).build());

		positions.add(Position.builder().positionName("Financial Analyst").positionCode("FIN-ANA")
				.salaryRangeMin(12000000L).salaryRangeMax(25000000L)
				.baseWorkTimes(8L).point(85L).department(finance).build());


		// ---------- ADMIN ------------
		positions.add(Position.builder().positionName("Admin Manager").positionCode("ADM-MAN")
				.salaryRangeMin(18000000L).salaryRangeMax(30000000L)
				.baseWorkTimes(8L).point(100L).department(admin).build());

		positions.add(Position.builder().positionName("Office Admin").positionCode("ADM-OFF")
				.salaryRangeMin(7000000L).salaryRangeMax(13000000L)
				.baseWorkTimes(8L).point(40L).department(admin).build());

		positions.add(Position.builder().positionName("Receptionist").positionCode("ADM-REC")
				.salaryRangeMin(6000000L).salaryRangeMax(10000000L)
				.baseWorkTimes(8L).point(30L).department(admin).build());

		positions.add(Position.builder().positionName("Asset Manager").positionCode("ADM-AST")
				.salaryRangeMin(10000000L).salaryRangeMax(20000000L)
				.baseWorkTimes(8L).point(70L).department(admin).build());


		// ---------- IT ------------
		positions.add(Position.builder().positionName("IT Manager").positionCode("IT-MAN")
				.salaryRangeMin(25000000L).salaryRangeMax(45000000L)
				.baseWorkTimes(8L).point(120L).department(it).build());

		positions.add(Position.builder().positionName("System Admin").positionCode("IT-SYS")
				.salaryRangeMin(15000000L).salaryRangeMax(30000000L)
				.baseWorkTimes(8L).point(90L).department(it).build());

		positions.add(Position.builder().positionName("Developer").positionCode("IT-DEV")
				.salaryRangeMin(12000000L).salaryRangeMax(25000000L)
				.baseWorkTimes(8L).point(80L).department(it).build());

		positions.add(Position.builder().positionName("QA/QC").positionCode("IT-QA")
				.salaryRangeMin(10000000L).salaryRangeMax(20000000L)
				.baseWorkTimes(8L).point(70L).department(it).build());

		positions.add(Position.builder().positionName("Network Engineer").positionCode("IT-NET")
				.salaryRangeMin(13000000L).salaryRangeMax(23000000L)
				.baseWorkTimes(8L).point(75L).department(it).build());


		// ---------- SALES ------------
		positions.add(Position.builder().positionName("Sales Director").positionCode("SAL-DIR")
				.salaryRangeMin(30000000L).salaryRangeMax(60000000L)
				.baseWorkTimes(8L).point(150L).department(sales).build());

		positions.add(Position.builder().positionName("Sales Manager").positionCode("SAL-MAN")
				.salaryRangeMin(20000000L).salaryRangeMax(40000000L)
				.baseWorkTimes(8L).point(110L).department(sales).build());

		positions.add(Position.builder().positionName("Sales Executive").positionCode("SAL-EXE")
				.salaryRangeMin(8000000L).salaryRangeMax(20000000L)
				.baseWorkTimes(8L).point(60L).department(sales).build());

		positions.add(Position.builder().positionName("Account Manager").positionCode("SAL-ACC")
				.salaryRangeMin(12000000L).salaryRangeMax(25000000L)
				.baseWorkTimes(8L).point(85L).department(sales).build());


		// ---------- MARKETING ------------
		positions.add(Position.builder().positionName("Marketing Manager").positionCode("MKT-MAN")
				.salaryRangeMin(20000000L).salaryRangeMax(40000000L)
				.baseWorkTimes(8L).point(110L).department(marketing).build());

		positions.add(Position.builder().positionName("Content Creator").positionCode("MKT-CON")
				.salaryRangeMin(8000000L).salaryRangeMax(16000000L)
				.baseWorkTimes(8L).point(50L).department(marketing).build());

		positions.add(Position.builder().positionName("SEO Specialist").positionCode("MKT-SEO")
				.salaryRangeMin(9000000L).salaryRangeMax(18000000L)
				.baseWorkTimes(8L).point(60L).department(marketing).build());

		positions.add(Position.builder().positionName("Graphic Designer").positionCode("MKT-DES")
				.salaryRangeMin(9000000L).salaryRangeMax(17000000L)
				.baseWorkTimes(8L).point(55L).department(marketing).build());


		// ---------- MANUFACTURING ------------
		positions.add(Position.builder().positionName("Operation Manager").positionCode("MFG-MAN")
				.salaryRangeMin(20000000L).salaryRangeMax(35000000L)
				.baseWorkTimes(8L).point(110L).department(manufacturing).build());

		positions.add(Position.builder().positionName("Supervisor").positionCode("MFG-SUP")
				.salaryRangeMin(12000000L).salaryRangeMax(22000000L)
				.baseWorkTimes(8L).point(70L).department(manufacturing).build());

		positions.add(Position.builder().positionName("Worker").positionCode("MFG-WRK")
				.salaryRangeMin(6000000L).salaryRangeMax(12000000L)
				.baseWorkTimes(8L).point(30L).department(manufacturing).build());

		positions.add(Position.builder().positionName("QC/QA Staff").positionCode("MFG-QA")
				.salaryRangeMin(8000000L).salaryRangeMax(16000000L)
				.baseWorkTimes(8L).point(50L).department(manufacturing).build());

		// Save all
		positionRepository.saveAll(positions);
	}
	@Transactional
	private void createDepartmentManagers() {
		// Lấy danh sách tất cả phòng ban
		List<Department> departments = departmentRepository.findAll();

		for (Department department : departments) {
			if (department.getManager() != null) {
				continue;
			}
			// Tạo tài khoản trưởng phòng
			String code = department.getDepartmentCode() + "-HEAD"; // ví dụ HR-HEAD, FIN-HEAD
			String fullName = department.getDepartmentName() + " Manager";

			Employee manager = Employee.builder()
					.employeeCode(code)
					.fullName(fullName)
					.email(code.toLowerCase() + "@company.com")
					.password(passwordEncoder.encode("123456")) // mật khẩu mặc định
					.role(EmployeeRole.MN)
					.department(department) // gán vào phòng ban
					.build();
			department.setManager(manager);
			employeeRepository.save(manager);
			departmentRepository.save(department);
		}
	}

}

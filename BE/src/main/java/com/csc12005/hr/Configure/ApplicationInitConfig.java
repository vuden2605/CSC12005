package com.csc12005.hr.Configure;

import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationInitConfig implements CommandLineRunner {
	private final EmployeeRepository employeeRepository;
	private final PasswordEncoder passwordEncoder;
	@Override
	public void run(String... args) throws Exception {
		if(!employeeRepository.existsByEmployeeCode("admin")) {
			Employee admin = Employee.builder()
					.employeeCode("admin")
					.fullName("Administrator")
					.email("vuden2605@gmail.com")
					.password(passwordEncoder.encode("admin"))
					.role("ADMIN")
					.build();
			employeeRepository.save(admin);
		}
	}
}

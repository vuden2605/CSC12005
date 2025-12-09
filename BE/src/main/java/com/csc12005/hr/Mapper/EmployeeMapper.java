package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.ViewSubEmployeeBasicResponse;
import com.csc12005.hr.Entity.Employee;
import org.mapstruct.Mapper;
// import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    // Map từ DTO tạo mới nhân viên (EmployeeCreationRequest) thành Entity (Employee)
    Employee toEmployee(EmployeeCreationRequest employeeCreationRequest);

    // Map từ Entity (Employee) sang DTO trả về (EmployeeResponse)
    EmployeeResponse toEmployeeResponse(Employee employee);

    // Map từ Entity (Employee) sang DTO trả về thông tin nhân viên dưới quyền (ViewSubEmployeeBasicResponse)
    ViewSubEmployeeBasicResponse toViewSubEmployeeBasicResponse(Employee employee);
}

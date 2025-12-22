package com.csc12005.hr.Service.EmployeeService;

import com.csc12005.hr.DTO.Request.EmployeeCreationRequest;
import com.csc12005.hr.DTO.Request.EmployeeUpdateRequest;
import com.csc12005.hr.DTO.Response.EmployeeListItemResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;

import java.util.List;

public interface IEmployeeService {
    public EmployeeResponse createEmployee(EmployeeCreationRequest employeeCreationRequest) ;
    public EmployeeResponse getMyInfo();
    public EmployeeResponse updateUser(EmployeeUpdateRequest employeeUpdateRequest);
    // THÊM CHO NGHIỆP VỤ HR ADMIN
    // Xem danh sách nhân viên (status = null => all; true => active; false => inactive)
    List<EmployeeListItemResponse> getEmployeesForHr(Boolean status);

    // Vô hiệu hóa nhân viên (soft delete)
    void deactivateEmployeeForHr(Long employeeId);
}

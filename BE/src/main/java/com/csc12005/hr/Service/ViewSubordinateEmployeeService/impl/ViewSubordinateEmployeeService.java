package com.csc12005.hr.Service.ViewSubordinateEmployeeService.impl;

import com.csc12005.hr.DTO.Request.ViewSubEmployeesFilterRequest;
import com.csc12005.hr.DTO.Response.*;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Enums.EmployeeRole;
import com.csc12005.hr.Exception.AppException;
import com.csc12005.hr.Exception.ErrorCode;
import com.csc12005.hr.Exception.NotFoundException;
import com.csc12005.hr.Mapper.EmployeeMapper;
import com.csc12005.hr.Repository.EmployeeRepository;
import com.csc12005.hr.Service.ViewSubordinateEmployeeService.IViewSubordinateEmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ViewSubordinateEmployeeService implements IViewSubordinateEmployeeService {

        private final EmployeeRepository employeeRepository;
        private final EmployeeMapper employeeMapper;

@Override
public ViewSubordinateEmployeesListResponse getSubordinateEmployees(
        Long managerId,
        ViewSubEmployeesFilterRequest filter
) {
        // 1. Lấy thông tin Manager
        Employee manager = employeeRepository.findById(managerId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy Trưởng bộ phận"));

        // 2. Kiểm tra role của người dùng
        if (manager.getRole() != EmployeeRole.MN) {
                throw new AppException(ErrorCode.FORBIDDEN, "Nhân viên này không phải Trưởng bộ phận");
        }

        // 3. Kiểm tra phòng ban của manager
        if (manager.getDepartment() == null) {
                throw new AppException(ErrorCode.FORBIDDEN, "Trưởng bộ phận chưa được phân công phòng ban");
        }
        Long departmentId = manager.getDepartment().getDepartmentId();

        // 4. Lấy danh sách nhân viên trong phòng ban với thông tin phòng ban và vị trí
        List<Employee> employees =
                employeeRepository.findByDepartmentIdWithDepartmentAndPosition(departmentId);

        // 5. Lọc theo status - active / inactive / all
        if (filter.getStatus() != null && !filter.getStatus().equalsIgnoreCase("all")) {
            // Status chỉ kiểm tra true/false
            boolean statusFilter = filter.getStatus().equalsIgnoreCase("active"); // Chuyển status sang boolean
                employees = employees.stream()
                    .filter(e -> e.getStatus() == statusFilter) // So sánh trực tiếp với true/false
                        .collect(Collectors.toList());
        }

        // 6. Lọc theo search (tên hoặc mã nhân viên)
        if (filter.getSearch() != null && !filter.getSearch().isBlank()) {
                String keyword = filter.getSearch().toLowerCase(Locale.ROOT);
                employees = employees.stream()
                        .filter(e ->
                                (e.getFullName() != null
                                        && e.getFullName().toLowerCase(Locale.ROOT).contains(keyword))
                                        ||
                                (e.getEmployeeCode() != null
                                        && e.getEmployeeCode().toLowerCase(Locale.ROOT).contains(keyword))
)
.collect(Collectors.toList());
        }

        // 7. Loại bỏ chính manager khỏi danh sách
        employees = employees.stream()
                .filter(e -> !Objects.equals(e.getEmployeeId(), managerId))
                .collect(Collectors.toList());

        // 8. Phân trang
        int page = (filter.getPage() == null || filter.getPage() <= 0) ? 1 : filter.getPage();
        int pageSize = (filter.getPageSize() == null || filter.getPageSize() <= 0) ? 20 : filter.getPageSize();

        long totalRecords = employees.size();
        int totalPages = (int) Math.ceil((double) totalRecords / pageSize);

        // 9. Sắp xếp và cắt dữ liệu theo trang
        List<Employee> pagedEmployees = employees.stream()
                .sorted(Comparator.comparing(
                        Employee::getFullName,
                        Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)))
                .skip((long) (page - 1) * pageSize)
                .limit(pageSize)
                .collect(Collectors.toList());

        // 10. Map sang DTO
        List<ViewSubEmployeeBasicResponse> employeeDtos = pagedEmployees.stream()
                .map(employeeMapper::toViewSubEmployeeBasicResponse)
                .collect(Collectors.toList());

        // 11. Thông tin phân trang
        ViewSubEmployeesPaginationResponse pagination = ViewSubEmployeesPaginationResponse.builder()
                .page(page)
                .pageSize(pageSize)
                .totalRecords(totalRecords)
                .totalPages(totalPages)
                .build();

        // 12. Thông tin phòng ban
        ViewSubDepartmentInfoResponse deptInfo = ViewSubDepartmentInfoResponse.builder()
                .departmentId(departmentId)
                .departmentName(manager.getDepartment().getDepartmentName())
                .totalEmployees(totalRecords)
                .build();

        // 13. Trả về danh sách nhân viên dưới quyền
        return ViewSubordinateEmployeesListResponse.builder()
                .employees(employeeDtos)
                .pagination(pagination)
                .departmentInfo(deptInfo)
                .build();
}

@Override
public byte[] exportSubordinateEmployees(Long managerId, String format) {
        return new byte[0];
}
}

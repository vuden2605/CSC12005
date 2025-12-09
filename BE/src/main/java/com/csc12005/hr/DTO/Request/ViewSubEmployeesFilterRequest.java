package com.csc12005.hr.DTO.Request;

import lombok.Data;

@Data
public class ViewSubEmployeesFilterRequest {
    private String search; // Tìm kiếm theo tên hoặc mã nhân viên
    private String status; // Lọc theo trạng thái
    private Integer page;   // Trang hiện tại
    private Integer pageSize; // Số bản ghi mỗi trang
}

package com.csc12005.hr.DTO.Response;

public class EmployeeListItemResponse {
    public Long employeeId;
    public String fullName;
    public String departmentName;
    public String positionName;
    public Boolean status; // true = active, false = inactive

    public EmployeeListItemResponse(Long employeeId, String fullName, String departmentName, String positionName, Boolean status) {
        this.employeeId = employeeId;
        this.fullName = fullName;
        this.departmentName = departmentName;
        this.positionName = positionName;
        this.status = status;
    }
}

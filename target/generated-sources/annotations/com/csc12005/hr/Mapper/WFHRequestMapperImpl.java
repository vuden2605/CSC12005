package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.WFHCreationRequest;
import com.csc12005.hr.DTO.Response.DepartmentResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.PositionResponse;
import com.csc12005.hr.DTO.Response.WFHResponse;
import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Position;
import com.csc12005.hr.Entity.WFHRequest;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-19T10:06:40+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.1 (Oracle Corporation)"
)
@Component
public class WFHRequestMapperImpl implements WFHRequestMapper {

    @Override
    public WFHRequest toWFHRequest(WFHCreationRequest wfhCreationRequest) {
        if ( wfhCreationRequest == null ) {
            return null;
        }

        WFHRequest.WFHRequestBuilder<?, ?> wFHRequest = WFHRequest.builder();

        wFHRequest.requestAttachment( wfhCreationRequest.getRequestAttachment() );
        wFHRequest.reason( wfhCreationRequest.getReason() );
        wFHRequest.startDate( wfhCreationRequest.getStartDate() );
        wFHRequest.endDate( wfhCreationRequest.getEndDate() );

        return wFHRequest.build();
    }

    @Override
    public WFHResponse toWFHResponse(WFHRequest wfhRequest) {
        if ( wfhRequest == null ) {
            return null;
        }

        WFHResponse.WFHResponseBuilder<?, ?> wFHResponse = WFHResponse.builder();

        wFHResponse.requestId( wfhRequest.getRequestId() );
        if ( wfhRequest.getRequestType() != null ) {
            wFHResponse.requestType( wfhRequest.getRequestType().name() );
        }
        wFHResponse.status( wfhRequest.getStatus() );
        wFHResponse.requestAttachment( wfhRequest.getRequestAttachment() );
        wFHResponse.reason( wfhRequest.getReason() );
        wFHResponse.createdAt( wfhRequest.getCreatedAt() );
        wFHResponse.updatedAt( wfhRequest.getUpdatedAt() );
        wFHResponse.employee( employeeToEmployeeResponse( wfhRequest.getEmployee() ) );
        wFHResponse.startDate( wfhRequest.getStartDate() );
        wFHResponse.endDate( wfhRequest.getEndDate() );

        return wFHResponse.build();
    }

    protected DepartmentResponse departmentToDepartmentResponse(Department department) {
        if ( department == null ) {
            return null;
        }

        DepartmentResponse.DepartmentResponseBuilder departmentResponse = DepartmentResponse.builder();

        departmentResponse.departmentName( department.getDepartmentName() );
        departmentResponse.departmentCode( department.getDepartmentCode() );

        return departmentResponse.build();
    }

    protected PositionResponse positionToPositionResponse(Position position) {
        if ( position == null ) {
            return null;
        }

        PositionResponse.PositionResponseBuilder positionResponse = PositionResponse.builder();

        positionResponse.positionName( position.getPositionName() );
        positionResponse.positionCode( position.getPositionCode() );
        positionResponse.salaryRangeMin( position.getSalaryRangeMin() );
        positionResponse.salaryRangeMax( position.getSalaryRangeMax() );
        positionResponse.baseWorkTimes( position.getBaseWorkTimes() );
        positionResponse.point( position.getPoint() );

        return positionResponse.build();
    }

    protected EmployeeResponse employeeToEmployeeResponse(Employee employee) {
        if ( employee == null ) {
            return null;
        }

        EmployeeResponse.EmployeeResponseBuilder employeeResponse = EmployeeResponse.builder();

        employeeResponse.employeeId( employee.getEmployeeId() );
        employeeResponse.employeeCode( employee.getEmployeeCode() );
        employeeResponse.fullName( employee.getFullName() );
        employeeResponse.email( employee.getEmail() );
        employeeResponse.phone( employee.getPhone() );
        employeeResponse.address( employee.getAddress() );
        employeeResponse.birthDate( employee.getBirthDate() );
        employeeResponse.nationalCode( employee.getNationalCode() );
        employeeResponse.taxCode( employee.getTaxCode() );
        employeeResponse.bankName( employee.getBankName() );
        employeeResponse.bankAccount( employee.getBankAccount() );
        employeeResponse.baseSalary( employee.getBaseSalary() );
        employeeResponse.hireDate( employee.getHireDate() );
        employeeResponse.department( departmentToDepartmentResponse( employee.getDepartment() ) );
        employeeResponse.position( positionToPositionResponse( employee.getPosition() ) );
        employeeResponse.avatarUrl( employee.getAvatarUrl() );
        employeeResponse.role( employee.getRole() );

        return employeeResponse.build();
    }
}

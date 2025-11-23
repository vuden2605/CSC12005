package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.TimeSheetCreationRequest;
import com.csc12005.hr.DTO.Response.DepartmentResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.PositionResponse;
import com.csc12005.hr.DTO.Response.TimeSheetResponse;
import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Position;
import com.csc12005.hr.Entity.TimeSheet;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-24T00:22:25+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.1 (Oracle Corporation)"
)
@Component
public class TimeSheetMapperImpl implements TimeSheetMapper {

    @Override
    public TimeSheet toTimeSheet(TimeSheetCreationRequest timeSheetRequestCreationRequest) {
        if ( timeSheetRequestCreationRequest == null ) {
            return null;
        }

        TimeSheet.TimeSheetBuilder timeSheet = TimeSheet.builder();

        return timeSheet.build();
    }

    @Override
    public TimeSheetResponse toTimeSheetResponse(TimeSheet timeSheet) {
        if ( timeSheet == null ) {
            return null;
        }

        TimeSheetResponse.TimeSheetResponseBuilder<?, ?> timeSheetResponse = TimeSheetResponse.builder();

        timeSheetResponse.timesheetId( timeSheet.getTimesheetId() );
        timeSheetResponse.workDate( timeSheet.getWorkDate() );
        timeSheetResponse.checkIn( timeSheet.getCheckIn() );
        timeSheetResponse.checkOut( timeSheet.getCheckOut() );
        timeSheetResponse.status( timeSheet.getStatus() );
        timeSheetResponse.employee( employeeToEmployeeResponse( timeSheet.getEmployee() ) );

        return timeSheetResponse.build();
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

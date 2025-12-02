package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.ProjectCreationRequest;
import com.csc12005.hr.DTO.Response.DepartmentResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.PositionResponse;
import com.csc12005.hr.DTO.Response.ProjectResponse;
import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Position;
import com.csc12005.hr.Entity.Project;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-01T15:38:54+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.1 (Oracle Corporation)"
)
@Component
public class ProjectMapperImpl implements ProjectMapper {

    @Override
    public Project toProject(ProjectCreationRequest projectCreationRequest) {
        if ( projectCreationRequest == null ) {
            return null;
        }

        Project.ProjectBuilder project = Project.builder();

        project.projectCode( projectCreationRequest.getProjectCode() );
        project.projectName( projectCreationRequest.getProjectName() );
        project.description( projectCreationRequest.getDescription() );
        project.startDate( projectCreationRequest.getStartDate() );
        project.endDate( projectCreationRequest.getEndDate() );
        project.priority( projectCreationRequest.getPriority() );

        return project.build();
    }

    @Override
    public ProjectResponse toProjectResponse(Project project) {
        if ( project == null ) {
            return null;
        }

        ProjectResponse.ProjectResponseBuilder projectResponse = ProjectResponse.builder();

        projectResponse.id( project.getId() );
        projectResponse.projectCode( project.getProjectCode() );
        projectResponse.projectName( project.getProjectName() );
        projectResponse.description( project.getDescription() );
        projectResponse.startDate( project.getStartDate() );
        projectResponse.endDate( project.getEndDate() );
        projectResponse.status( project.getStatus() );
        projectResponse.priority( project.getPriority() );
        projectResponse.createdAt( project.getCreatedAt() );
        projectResponse.updatedAt( project.getUpdatedAt() );
        projectResponse.progress_percentage( project.getProgress_percentage() );
        projectResponse.department( departmentToDepartmentResponse( project.getDepartment() ) );
        projectResponse.leader( employeeToEmployeeResponse( project.getLeader() ) );

        return projectResponse.build();
    }

    protected DepartmentResponse departmentToDepartmentResponse(Department department) {
        if ( department == null ) {
            return null;
        }

        DepartmentResponse.DepartmentResponseBuilder departmentResponse = DepartmentResponse.builder();

        departmentResponse.id( department.getId() );
        departmentResponse.departmentName( department.getDepartmentName() );
        departmentResponse.departmentCode( department.getDepartmentCode() );

        return departmentResponse.build();
    }

    protected PositionResponse positionToPositionResponse(Position position) {
        if ( position == null ) {
            return null;
        }

        PositionResponse.PositionResponseBuilder positionResponse = PositionResponse.builder();

        positionResponse.id( position.getId() );
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

        employeeResponse.id( employee.getId() );
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

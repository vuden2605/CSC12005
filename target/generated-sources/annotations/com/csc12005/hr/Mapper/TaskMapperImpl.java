package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.TaskCreationRequest;
import com.csc12005.hr.DTO.Response.DepartmentResponse;
import com.csc12005.hr.DTO.Response.EmployeeResponse;
import com.csc12005.hr.DTO.Response.PositionResponse;
import com.csc12005.hr.DTO.Response.ProjectResponse;
import com.csc12005.hr.DTO.Response.TaskResponse;
import com.csc12005.hr.Entity.Department;
import com.csc12005.hr.Entity.Employee;
import com.csc12005.hr.Entity.Position;
import com.csc12005.hr.Entity.Project;
import com.csc12005.hr.Entity.Task;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-27T22:05:26+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.1 (Oracle Corporation)"
)
@Component
public class TaskMapperImpl implements TaskMapper {

    @Override
    public Task toTask(TaskCreationRequest taskCreationRequest) {
        if ( taskCreationRequest == null ) {
            return null;
        }

        Task.TaskBuilder task = Task.builder();

        task.taskName( taskCreationRequest.getTaskName() );
        task.description( taskCreationRequest.getDescription() );
        task.priority( taskCreationRequest.getPriority() );
        task.estimatedTime( taskCreationRequest.getEstimatedTime() );
        task.timeSpent( taskCreationRequest.getTimeSpent() );
        task.startDate( taskCreationRequest.getStartDate() );
        task.dueDate( taskCreationRequest.getDueDate() );

        return task.build();
    }

    @Override
    public TaskResponse toTaskResponse(Task task) {
        if ( task == null ) {
            return null;
        }

        TaskResponse.TaskResponseBuilder taskResponse = TaskResponse.builder();

        taskResponse.id( task.getId() );
        taskResponse.taskName( task.getTaskName() );
        taskResponse.description( task.getDescription() );
        taskResponse.priority( task.getPriority() );
        taskResponse.status( task.getStatus() );
        taskResponse.estimatedTime( task.getEstimatedTime() );
        taskResponse.timeSpent( task.getTimeSpent() );
        taskResponse.startDate( task.getStartDate() );
        taskResponse.dueDate( task.getDueDate() );
        taskResponse.completedDate( task.getCompletedDate() );
        taskResponse.createdAt( task.getCreatedAt() );
        taskResponse.updatedAt( task.getUpdatedAt() );
        taskResponse.project( projectToProjectResponse( task.getProject() ) );
        taskResponse.assignedTo( employeeToEmployeeResponse( task.getAssignedTo() ) );

        return taskResponse.build();
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

    protected ProjectResponse projectToProjectResponse(Project project) {
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
}

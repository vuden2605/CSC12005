package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Request.DepartmentCreationRequest;
import com.csc12005.hr.DTO.Response.DepartmentResponse;
import com.csc12005.hr.Entity.Department;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-16T16:11:58+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.1 (Oracle Corporation)"
)
@Component
public class DepartmentMapperImpl implements DepartmentMapper {

    @Override
    public Department toDepartment(DepartmentCreationRequest departmentCreationRequest) {
        if ( departmentCreationRequest == null ) {
            return null;
        }

        Department.DepartmentBuilder department = Department.builder();

        department.departmentName( departmentCreationRequest.getDepartmentName() );
        department.departmentCode( departmentCreationRequest.getDepartmentCode() );

        return department.build();
    }

    @Override
    public DepartmentResponse toDepartmentResponse(Department department) {
        if ( department == null ) {
            return null;
        }

        DepartmentResponse.DepartmentResponseBuilder departmentResponse = DepartmentResponse.builder();

        departmentResponse.departmentName( department.getDepartmentName() );
        departmentResponse.departmentCode( department.getDepartmentCode() );

        return departmentResponse.build();
    }
}

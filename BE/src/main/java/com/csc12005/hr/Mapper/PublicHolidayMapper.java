package com.csc12005.hr.Mapper;

import com.csc12005.hr.DTO.Response.PublicHolidayResponse;
import com.csc12005.hr.Entity.PublicHoliday;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PublicHolidayMapper {
	PublicHoliday toEntity(com.csc12005.hr.DTO.Request.PublicHolidayCreationRequest dto);
	PublicHolidayResponse toResponse(PublicHoliday entity);
}

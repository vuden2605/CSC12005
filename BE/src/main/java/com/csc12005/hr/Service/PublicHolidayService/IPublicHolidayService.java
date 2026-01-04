package com.csc12005.hr.Service.PublicHolidayService;

import com.csc12005.hr.DTO.Request.HolidayFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Response.ImportResult;
import com.csc12005.hr.DTO.Response.PublicHolidayResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface IPublicHolidayService {
	PublicHolidayResponse createPublicHoliday(com.csc12005.hr.DTO.Request.PublicHolidayCreationRequest request);
	PublicHolidayResponse getPublicHolidayById(Long id);
	Page<PublicHolidayResponse> filterHolidays(HolidayFilterRequest filterRequest, PageRequestDTO pageRequest);
	ImportResult importHolidays(MultipartFile file);

}

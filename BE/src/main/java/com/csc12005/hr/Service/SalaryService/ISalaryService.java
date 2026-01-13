package com.csc12005.hr.Service.SalaryService;

import com.csc12005.hr.DTO.Request.MySalaryFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.SalaryFilterRequest;
import com.csc12005.hr.DTO.Request.UpdateSalaryStatus;
import com.csc12005.hr.DTO.Response.SalaryResponse;
import com.csc12005.hr.Entity.MonthlyAttendanceSummary;
import com.csc12005.hr.Enums.SalaryStatus;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ISalaryService {

    void generatePayroll();
    Page<SalaryResponse> getAll(SalaryFilterRequest salaryFilterRequest, PageRequestDTO pageRequestDTO);
    Page<SalaryResponse> getMySalaries(
            MySalaryFilterRequest request,
            PageRequestDTO pageRequestDTO    );
    void updateStatus(UpdateSalaryStatus request);

	String generateQRPayRoll(Long salaryId);
}

package com.csc12005.hr.Service.SalaryService;

import com.csc12005.hr.DTO.Request.MySalaryFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.SalaryFilterRequest;
import com.csc12005.hr.DTO.Response.SalaryResponse;
import com.csc12005.hr.Enums.SalaryStatus;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ISalaryService {
    public void generatePayroll(Long month, Long year );
    public Page<SalaryResponse> getAll(SalaryFilterRequest salaryFilterRequest, PageRequestDTO pageRequestDTO);
    public Page<SalaryResponse> getMySalaries(
            MySalaryFilterRequest request,
            PageRequestDTO pageRequestDTO    );
    public void updateStatus(Long month, Long year, SalaryStatus status);
}

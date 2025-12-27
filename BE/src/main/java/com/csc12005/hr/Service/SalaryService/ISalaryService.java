package com.csc12005.hr.Service.SalaryService;

import com.csc12005.hr.DTO.Request.MySalaryFilterRequest;
import com.csc12005.hr.DTO.Request.PageRequestDTO;
import com.csc12005.hr.DTO.Request.SalaryFilterRequest;
import com.csc12005.hr.DTO.Response.SalaryResponse;
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
    public void paySalary(Long month, Long year);
}

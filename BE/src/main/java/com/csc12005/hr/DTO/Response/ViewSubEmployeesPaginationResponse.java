package com.csc12005.hr.DTO.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ViewSubEmployeesPaginationResponse {

    private int page;
    private int pageSize;
    private long totalRecords;
    private int totalPages;
}

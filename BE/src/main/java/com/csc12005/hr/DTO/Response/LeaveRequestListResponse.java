package com.csc12005.hr.DTO.Response;

import lombok.Data;

import java.util.List;

@Data
public class LeaveRequestListResponse {

    private List<LeaveRequestListItemResponse> requests;

    private Integer page;

    private Integer pageSize;

    private Long totalItems;

    private Integer totalPages;
}

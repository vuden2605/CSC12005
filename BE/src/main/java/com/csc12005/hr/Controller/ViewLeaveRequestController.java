package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.ViewLeaveRequestFilterRequest;
import com.csc12005.hr.DTO.Response.LeaveRequestListResponse;
import com.csc12005.hr.Service.ViewLeaveRequestService.IViewLeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leave-requests")
@RequiredArgsConstructor
public class ViewLeaveRequestController {

    private final IViewLeaveRequestService service;

    @GetMapping("/{employeeId}")
    public ResponseEntity<?> getLeaveRequests(
            @PathVariable Long employeeId,
            @ModelAttribute ViewLeaveRequestFilterRequest filters
    ) {
        LeaveRequestListResponse data = service.getLeaveRequests(employeeId, filters);

        return ResponseEntity.ok().body(data);
    }
}

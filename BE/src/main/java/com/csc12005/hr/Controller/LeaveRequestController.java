package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.LeaveRequestCreationRequest;
import com.csc12005.hr.DTO.Response.LeaveRequestResponse;
import com.csc12005.hr.Service.LeaveRequestService.ILeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.CompletableFuture;



import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/leave-requests")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final ILeaveRequestService leaveRequestService;

    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveRequestResponse> approve(
            @PathVariable Long id,
            @RequestBody LeaveRequestCreationRequest dto
    ) {
        return ResponseEntity.ok(leaveRequestService.approveLeaveRequest(id, dto));
    }
}

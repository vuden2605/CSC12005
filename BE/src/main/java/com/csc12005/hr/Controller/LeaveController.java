package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.LeaveRequestCreationRequest;
import com.csc12005.hr.DTO.Response.LeaveResponse;
import com.csc12005.hr.Service.ILeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/leave-requests")
public class LeaveController {

    private final ILeaveRequestService leaveRequestService;

    @Autowired
    public LeaveController(ILeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public CompletableFuture<ResponseEntity<LeaveResponse>> createLeaveRequest(
            @RequestPart("data") LeaveRequestCreationRequest dto,
            @RequestPart(value = "file", required = false) MultipartFile file
            ) throws ExecutionException, InterruptedException {
        

        dto.setAttachment(file);

        Integer employeeId = 100;


        CompletableFuture<LeaveResponse> responseFuture = leaveRequestService.createLeaveRequestAsync(employeeId, dto);

        return responseFuture.thenApply(response -> ResponseEntity.ok(response));
    }


    @GetMapping
    public CompletableFuture<ResponseEntity<?>> getLeaveRequests(
            @RequestParam(required = false) String filters
    ) {
        Integer employeeId = 100;

        CompletableFuture<?> responseFuture = leaveRequestService.getLeaveRequestsAsync(employeeId, filters);

        return responseFuture.thenApply(response -> ResponseEntity.ok(response));
    }
}
package com.csc12005.hr.Controller;

import com.csc12005.hr.DTO.Request.ViewSubEmployeesFilterRequest;
import com.csc12005.hr.DTO.Response.ViewSubordinateEmployeesListResponse;
import com.csc12005.hr.Service.ViewSubordinateEmployeeService.IViewSubordinateEmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/managers")
@RequiredArgsConstructor
public class ViewSubordinateEmployeeController {

    private final IViewSubordinateEmployeeService viewSubordinateEmployeeService;

    @GetMapping("/{managerId}/employees")
    public ResponseEntity<ViewSubordinateEmployeesListResponse> getSubordinateEmployees(
            @PathVariable Long managerId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "20") Integer pageSize,
            Authentication authentication
    ) {
        Long currentUserId = Long.valueOf(authentication.getName());
        boolean isManager = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_MANAGER"));

        if (!isManager) {
            return ResponseEntity.status(403).build();
        }

        if (!currentUserId.equals(managerId)) {
            return ResponseEntity.status(403).build();
        }

        ViewSubEmployeesFilterRequest filter = new ViewSubEmployeesFilterRequest();
        filter.setSearch(search);
        filter.setStatus(status);
        filter.setPage(page);
        filter.setPageSize(pageSize);

        ViewSubordinateEmployeesListResponse data = viewSubordinateEmployeeService.getSubordinateEmployees(managerId, filter);

        return ResponseEntity.ok(data);
    }
}

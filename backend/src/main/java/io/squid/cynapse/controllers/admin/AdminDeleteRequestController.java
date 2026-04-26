package io.squid.cynapse.controllers.admin;

import io.squid.cynapse.entities.DeleteRequest;
import io.squid.cynapse.enums.DeleteRequestStatus;
import io.squid.cynapse.services.DeleteRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/device-delete-request")
@PreAuthorize("@authService.hasRequiredRole('ADMIN')")
public class AdminDeleteRequestController {

    @Autowired
    private DeleteRequestService deleteRequestService;

    @GetMapping("/list")
    public ResponseEntity<List<DeleteRequest>> list(@RequestParam(value = "status", required = false) DeleteRequestStatus status) {
        return ResponseEntity.ok(this.deleteRequestService.findAll(status));
    }

    @GetMapping("/get")
    public ResponseEntity<?> get(@RequestParam("id") Long requestId) {
        DeleteRequest request = this.deleteRequestService.findById(requestId);
        if (request == null) {
            return ResponseEntity.badRequest().body("Delete request not found");
        }

        return ResponseEntity.ok(request);
    }

    @PostMapping("/approve")
    public ResponseEntity<?> approve(@RequestParam("id") Long requestId) {
        DeleteRequest request = this.deleteRequestService.review(requestId, DeleteRequestStatus.APPROVED);
        if (request == null) {
            return ResponseEntity.badRequest().body("Delete request not found, already reviewed or device no longer exists");
        }

        return ResponseEntity.ok(request);
    }

    @PostMapping("/reject")
    public ResponseEntity<?> reject(@RequestParam("id") Long requestId) {
        DeleteRequest request = this.deleteRequestService.review(requestId, DeleteRequestStatus.REJECTED);
        if (request == null) {
            return ResponseEntity.badRequest().body("Delete request not found or already reviewed");
        }

        return ResponseEntity.ok(request);
    }
}


package io.squid.cynapse.controllers;

import io.squid.cynapse.dto.DeleteRequestDTO;
import io.squid.cynapse.entities.DeleteRequest;
import io.squid.cynapse.services.DeleteRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/device-delete-request")
@PreAuthorize("@authService.hasRequiredRole('EXPERT')")
public class DeleteRequestController {

    @Autowired
    private DeleteRequestService deleteRequestService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody DeleteRequestDTO.CreatePayload payload) {
        DeleteRequest request = this.deleteRequestService.create(payload);
        if (request == null) {
            return ResponseEntity.badRequest().body("Invalid payload, unauthorized role, device not found or pending request already exists");
        }

        return ResponseEntity.ok(request);
    }

    @GetMapping("/my-list")
    public ResponseEntity<List<DeleteRequest>> getMyRequests() {
        return ResponseEntity.ok(this.deleteRequestService.findMine());
    }
}


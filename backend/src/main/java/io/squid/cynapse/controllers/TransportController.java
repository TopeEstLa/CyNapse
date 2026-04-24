package io.squid.cynapse.controllers;

import io.squid.cynapse.dto.TransportDTO;
import io.squid.cynapse.services.TransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author TopeEstLa
 */
@RestController
@RequestMapping("/api/transport")
public class TransportController {

    @Autowired
    private TransportService transportService;

    @GetMapping("/rer-a/next")
    public ResponseEntity<?> getNextRerAAtChateletLesHalles() {
        try {
            TransportDTO.NextDeparturesResponse response = this.transportService.getNextRerA();
            return ResponseEntity.ok(response);
        } catch (IllegalStateException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.internalServerError().body("Service transport indisponible");
        }
    }
}

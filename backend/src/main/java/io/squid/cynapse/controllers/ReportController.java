package io.squid.cynapse.controllers;

import io.squid.cynapse.services.ReportService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("@authService.hasRequiredRole('ADVANCED')")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping(value = "/sensors/{id}", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> downloadSensorReport(@PathVariable("id") Long sensorId) {
        String report = this.reportService.buildSensorReport(sensorId);
        if (report == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Sensor not found");
        }

        return buildAttachmentResponse(report, "sensor-" + sensorId + ".txt");
    }

    @GetMapping(value = "/actuators/{id}", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> downloadActuatorReport(@PathVariable("id") Long actuatorId) {
        String report = this.reportService.buildActuatorReport(actuatorId);
        if (report == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Actuator not found");
        }

        return buildAttachmentResponse(report, "actuator-" + actuatorId + ".txt");
    }

    @GetMapping(value = "/rooms/{id}", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> downloadRoomReport(@PathVariable("id") Long roomId) {
        String report = this.reportService.buildRoomReport(roomId);
        if (report == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Room not found");
        }

        return buildAttachmentResponse(report, "room-" + roomId + ".txt");
    }

    private ResponseEntity<String> buildAttachmentResponse(String report, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
        return new ResponseEntity<>(report, headers, HttpStatus.OK);
    }
}


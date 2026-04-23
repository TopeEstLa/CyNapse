package io.squid.cynapse.controllers;

import io.squid.cynapse.entities.ActuatorDevice;
import io.squid.cynapse.entities.ActuatorHistory;
import io.squid.cynapse.services.ActuatorDeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author TopeEstLa
 * Read-only endpoints for frontend to view actuator information and state
 */
@RestController
@RequestMapping("/api/actuator")
public class ActuatorController {

    @Autowired
    private ActuatorDeviceService actuatorDeviceService;

    /**
     * Get all actuators or actuators from a specific room
     * @param roomId optional room ID to filter actuators
     * @return List of actuators with their current state
     */
    @GetMapping("/list")
    public ResponseEntity<List<ActuatorDevice>> getActuators(@RequestParam(value = "roomId", required = false) Long roomId) {
        return ResponseEntity.ok(this.actuatorDeviceService.findByRoomId(roomId));
    }

    /**
     * Get a specific actuator with its details and state
     * @param actuatorId the ID of the actuator
     * @return Actuator details or error if not found
     */
    @GetMapping("/get")
    public ResponseEntity<?> getActuator(@RequestParam("id") long actuatorId) {
        ActuatorDevice device = this.actuatorDeviceService.findById(actuatorId);
        if (device == null) {
            return ResponseEntity.badRequest().body("Actuator not found");
        }
        return ResponseEntity.ok(device);
    }

    /**
     * Get the last 200 history entries from a specific actuator
     * @param actuatorId the ID of the actuator
     * @return List of last 200 actuator history entries ordered by most recent first
     */
    @GetMapping("/history")
    public ResponseEntity<?> getActuatorHistory(@RequestParam("id") long actuatorId) {
        ActuatorDevice device = this.actuatorDeviceService.findById(actuatorId);
        if (device == null) {
            return ResponseEntity.badRequest().body("Actuator not found");
        }
        List<ActuatorHistory> history = this.actuatorDeviceService.getLastHistory(actuatorId);
        return ResponseEntity.ok(history);
    }
}

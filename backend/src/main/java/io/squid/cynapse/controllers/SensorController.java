package io.squid.cynapse.controllers;

import io.squid.cynapse.entities.SensorDevice;
import io.squid.cynapse.entities.SensorReading;
import io.squid.cynapse.services.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author TopeEstLa
 * Read-only endpoints for frontend to view sensor information and readings
 */
@RestController
@RequestMapping("/api/sensor")
public class SensorController {

    @Autowired
    private DeviceService deviceService;



    /**
     * Get all sensors or sensors from a specific room
     *
     * @param roomId optional room ID to filter sensors
     * @return List of sensors
     */
    @GetMapping("/list")
    public ResponseEntity<List<SensorDevice>> getSensors(@RequestParam(value = "roomId", required = false) Long roomId) {
        List<SensorDevice> devices = this.deviceService.findByRoomId(roomId);
        return ResponseEntity.ok(devices);
    }

    /**
     * Get a specific sensor with its details and readings
     *
     * @param sensorId the ID of the sensor
     * @return Sensor details or error if not found
     */
    @GetMapping("/get")
    public ResponseEntity<?> getSensor(@RequestParam("id") long sensorId) {
        SensorDevice device = this.deviceService.findById(sensorId);
        if (device == null) {
            return ResponseEntity.badRequest().body("Sensor not found");
        }
        return ResponseEntity.ok(device);
    }

    /**
     * Get the last 200 readings from a specific sensor
     *
     * @param sensorId the ID of the sensor
     * @return List of last 200 sensor readings ordered by most recent first
     */
    @GetMapping("/readings")
    @PreAuthorize("@authService.hasRequiredRole('ADVANCED')")
    public ResponseEntity<?> getSensorReadings(@RequestParam("id") long sensorId) {
        SensorDevice device = this.deviceService.findById(sensorId);
        if (device == null) {
            return ResponseEntity.badRequest().body("Sensor not found");
        }
        List<SensorReading> readings = this.deviceService.getLastReadings(sensorId);
        return ResponseEntity.ok(readings);
    }
}

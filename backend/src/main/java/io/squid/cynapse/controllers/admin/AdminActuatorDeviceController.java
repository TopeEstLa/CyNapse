package io.squid.cynapse.controllers.admin;

import io.squid.cynapse.dto.DeviceDTO;
import io.squid.cynapse.entities.ActuatorDevice;
import io.squid.cynapse.services.ActuatorDeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/actuator-device")
@PreAuthorize("@authService.hasRequiredRole('ADMIN')")
public class AdminActuatorDeviceController {

    @Autowired
    private ActuatorDeviceService actuatorDeviceService;

    @GetMapping("/list")
    public ResponseEntity<List<ActuatorDevice>> getDevices(@RequestParam(value = "roomId", required = false) Long roomId) {
        return ResponseEntity.ok(this.actuatorDeviceService.findByRoomId(roomId));
    }

    @GetMapping("/get")
    public ResponseEntity<?> getDevice(@RequestParam("id") long deviceId) {
        ActuatorDevice device = this.actuatorDeviceService.findById(deviceId);
        if (device == null) {
            return ResponseEntity.badRequest().body("Actuator device not found");
        }

        return ResponseEntity.ok(device);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createDevice(@RequestBody DeviceDTO.ActuatorDevicePayload payload) {
        ActuatorDevice device = this.actuatorDeviceService.create(payload);
        if (device == null) {
            return ResponseEntity.badRequest().body("Invalid payload or room not found");
        }

        return ResponseEntity.ok(device);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateDevice(@RequestBody DeviceDTO.ActuatorDevicePayload payload) {
        ActuatorDevice device = this.actuatorDeviceService.update(payload);
        if (device == null) {
            return ResponseEntity.badRequest().body("Invalid payload or actuator device/room not found");
        }

        return ResponseEntity.ok(device);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteDevice(@RequestParam("id") long deviceId) {
        if (!this.actuatorDeviceService.delete(deviceId)) {
            return ResponseEntity.badRequest().body("Actuator device not found");
        }

        return ResponseEntity.ok("Actuator device deleted");
    }
}


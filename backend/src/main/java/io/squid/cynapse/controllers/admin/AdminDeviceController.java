package io.squid.cynapse.controllers.admin;

import io.squid.cynapse.dto.IoTDTO;
import io.squid.cynapse.entities.Device;
import io.squid.cynapse.services.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/device")
@PreAuthorize("@authService.hasRequiredRole('ADMIN')")
public class AdminDeviceController {

    @Autowired
    private DeviceService deviceService;

    @GetMapping("/list")
    public ResponseEntity<List<Device>> getDevices(@RequestParam(value = "roomId", required = false) Long roomId) {
        List<Device> devices = this.deviceService.findByRoomId(roomId);
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/get")
    public ResponseEntity<?> getDevice(@RequestParam("id") long deviceId) {
        Device device = this.deviceService.findById(deviceId);
        if (device == null) {
            return ResponseEntity.badRequest().body("Device not found");
        }

        return ResponseEntity.ok(device);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createDevice(@RequestBody IoTDTO.DevicePayload payload) {
        Device device = this.deviceService.create(payload);
        if (device == null) {
            return ResponseEntity.badRequest().body("Room not found");
        }

        return ResponseEntity.ok(device);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateDevice(@RequestBody IoTDTO.DevicePayload payload) {
        Device device = this.deviceService.update(payload);
        if (device == null) {
            return ResponseEntity.badRequest().body("Device or room not found");
        }

        return ResponseEntity.ok(device);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteDevice(@RequestParam("id") long deviceId) {
        if (!this.deviceService.delete(deviceId)) {
            return ResponseEntity.badRequest().body("Device not found");
        }

        return ResponseEntity.ok("Device deleted");
    }
}


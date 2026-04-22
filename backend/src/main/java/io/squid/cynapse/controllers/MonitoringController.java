package io.squid.cynapse.controllers;

import io.squid.cynapse.dto.IoTDTO;
import io.squid.cynapse.entities.Room;
import io.squid.cynapse.services.MonitoringService;
import io.squid.cynapse.services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitoring")
public class MonitoringController {

    @Autowired
    private MonitoringService monitoringService;

    @Autowired
    private RoomService roomService;

    @GetMapping("/overview")
    public ResponseEntity<IoTDTO.OverviewView> getOverview() {
        return ResponseEntity.ok(this.monitoringService.getOverview());
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getRooms() {
        return ResponseEntity.ok(this.roomService.findAll());
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<?> getRoomSnapshot(@PathVariable("roomId") long roomId) {
        IoTDTO.RoomSnapshotView snapshot = this.monitoringService.getRoomSnapshot(roomId);
        if (snapshot == null) {
            return ResponseEntity.badRequest().body("Room not found");
        }

        return ResponseEntity.ok(snapshot);
    }

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<?> getDeviceView(@PathVariable("deviceId") long deviceId) {
        IoTDTO.DeviceView snapshot = this.monitoringService.getDeviceView(deviceId);
        if (snapshot == null) {
            return ResponseEntity.badRequest().body("Device not found");
        }

        return ResponseEntity.ok(snapshot);
    }

    @GetMapping("/rooms/{deviceId}/history")
    public ResponseEntity<List<IoTDTO.ReadingView>> getDeviceHistory(@PathVariable("deviceId") long roomId,
                                                                   @RequestParam(value = "limit", defaultValue = "100") int limit) {
        return ResponseEntity.ok(this.monitoringService.getDeviceHistory(roomId, limit));
    }

    @GetMapping("/alerts/active")
    public ResponseEntity<List<IoTDTO.AlertView>> getActiveAlerts() {
        return ResponseEntity.ok(this.monitoringService.getActiveAlerts());
    }
}


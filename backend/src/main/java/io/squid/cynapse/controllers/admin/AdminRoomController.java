package io.squid.cynapse.controllers.admin;

import io.squid.cynapse.dto.DeviceDTO;
import io.squid.cynapse.entities.Room;
import io.squid.cynapse.services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/room")
@PreAuthorize("@authService.hasRequiredRole('ADMIN')")
public class AdminRoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/list")
    public ResponseEntity<List<Room>> getRooms() {
        return ResponseEntity.ok(this.roomService.findAll());
    }

    @GetMapping("/get")
    public ResponseEntity<?> getRoom(@RequestParam("id") long roomId) {
        Room room = this.roomService.findById(roomId);
        if (room == null) {
            return ResponseEntity.badRequest().body("Room not found");
        }

        return ResponseEntity.ok(room);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRoom(@RequestBody DeviceDTO.RoomPayload payload) {
        Room room = this.roomService.create(payload);
        if (room == null) {
            return ResponseEntity.badRequest().body("Room name already exists");
        }

        return ResponseEntity.ok(room);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateRoom(@RequestBody DeviceDTO.RoomPayload payload) {
        Room room = this.roomService.update(payload);
        if (room == null) {
            return ResponseEntity.badRequest().body("Room not found");
        }

        return ResponseEntity.ok(room);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteRoom(@RequestParam("id") long roomId) {
        if (!this.roomService.delete(roomId)) {
            return ResponseEntity.badRequest().body("Room not found");
        }

        return ResponseEntity.ok("Room deleted");
    }
}


package io.squid.cynapse.controllers;

import io.squid.cynapse.annotation.AddUserExp;
import io.squid.cynapse.entities.Room;
import io.squid.cynapse.services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author TopeEstLa
 * Read-only endpoints for frontend to view room information with sensor data
 */
@RestController
@RequestMapping("/api/room")
public class RoomController {

    @Autowired
    private RoomService roomService;

    /**
     * Get all rooms with their devices and sensor data
     *
     * @return List of all rooms
     */
    @GetMapping("/list")
    @AddUserExp(exp = 10)
    public ResponseEntity<List<Room>> getRooms() {
        return ResponseEntity.ok(this.roomService.findAll());
    }

    /**
     * Get a specific room with all its devices and sensor information
     *
     * @param roomId the ID of the room
     * @return Room details or error if not found
     */
    @GetMapping("/get")
    public ResponseEntity<?> getRoom(@RequestParam("id") long roomId) {
        Room room = this.roomService.findById(roomId);
        if (room == null) {
            return ResponseEntity.badRequest().body("Room not found");
        }
        return ResponseEntity.ok(room);
    }
}

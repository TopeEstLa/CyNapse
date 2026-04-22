package io.squid.cynapse.services;

import io.squid.cynapse.dto.DeviceDTO;
import io.squid.cynapse.entities.Room;
import io.squid.cynapse.enums.RoomStatus;
import io.squid.cynapse.repositories.SensorDeviceRepository;
import io.squid.cynapse.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private SensorDeviceRepository sensorDeviceRepository;

    public List<Room> findAll() {
        return this.roomRepository.findAll();
    }

    public Room findById(long roomId) {
        return this.roomRepository.findById(roomId).orElse(null);
    }

    public Room create(DeviceDTO.RoomPayload payload) {
        if (this.roomRepository.findByNameIgnoreCase(payload.name()).isPresent()) {
            return null;
        }

        Room room = new Room(payload.name(), payload.floorNumber(), payload.capacity());
        room.setStatus(RoomStatus.FREE);
        Room savedRoom =  this.roomRepository.save(room);
        this.createDefaultDevice(savedRoom);
        return savedRoom;
    }

    public void createDefaultDevice(Room room) {
        //create temp ceo population device

    }

    public Room update(DeviceDTO.RoomPayload payload) {
        if (payload.id() == null) {
            return null;
        }

        Room room = this.findById(payload.id());
        if (room == null) {
            return null;
        }

        if (!room.getName().equals(payload.name())) {
            Optional<Room> existingRoom = this.roomRepository.findByNameIgnoreCase(payload.name());
            if (existingRoom.isPresent()) return null;
        }

        room.setName(payload.name());
        room.setFloorNumber(payload.floorNumber());
        room.setCapacity(payload.capacity());
        return this.roomRepository.save(room);
    }

    public boolean delete(long roomId) {
        Room room = this.findById(roomId);
        if (room == null) {
            return false;
        }

        this.roomRepository.delete(room);
        return true;
    }
}


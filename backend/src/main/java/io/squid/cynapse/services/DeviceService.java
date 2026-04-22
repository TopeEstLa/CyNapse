package io.squid.cynapse.services;

import io.squid.cynapse.dto.DeviceDTO;
import io.squid.cynapse.entities.Room;
import io.squid.cynapse.entities.SensorDevice;
import io.squid.cynapse.enums.DeviceStatus;
import io.squid.cynapse.repositories.SensorDeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeviceService {

    @Autowired
    private SensorDeviceRepository sensorDeviceRepository;

    @Autowired
    private RoomService roomService;

    public List<SensorDevice> findAll() {
        return this.sensorDeviceRepository.findAll();
    }

    public List<SensorDevice> findByRoomId(Long roomId) {
        if (roomId == null) {
            return this.findAll();
        }
        return this.sensorDeviceRepository.findByRoomId(roomId);
    }

    public SensorDevice findById(long deviceId) {
        return this.sensorDeviceRepository.findById(deviceId).orElse(null);
    }

    public SensorDevice create(DeviceDTO.DevicePayload payload) {
        Room room = this.roomService.findById(payload.roomId());
        if (room == null) {
            return null;
        }

        SensorDevice device = new SensorDevice(payload.name(), room, payload.type());
        device.setStatus(payload.status() == null ? DeviceStatus.ONLINE : payload.status());
        device.setLastSeenAt(LocalDateTime.now());
        return this.sensorDeviceRepository.save(device);
    }

    public SensorDevice update(DeviceDTO.DevicePayload payload) {
        if (payload.id() == null) {
            return null;
        }

        SensorDevice device = this.findById(payload.id());
        if (device == null) {
            return null;
        }

        Room room = this.roomService.findById(payload.roomId());
        if (room == null) {
            return null;
        }

        device.setName(payload.name());
        device.setType(payload.type());
        device.setStatus(payload.status() == null ? DeviceStatus.ONLINE : payload.status());
        device.setRoom(room);
        return this.sensorDeviceRepository.save(device);
    }

    public boolean delete(long deviceId) {
        SensorDevice device = this.findById(deviceId);
        if (device == null) {
            return false;
        }

        this.sensorDeviceRepository.delete(device);
        return true;
    }

}


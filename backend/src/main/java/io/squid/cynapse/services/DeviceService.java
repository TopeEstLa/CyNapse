package io.squid.cynapse.services;

import io.squid.cynapse.dto.IoTDTO;
import io.squid.cynapse.entities.Device;
import io.squid.cynapse.entities.Room;
import io.squid.cynapse.enums.DeviceStatus;
import io.squid.cynapse.enums.DeviceType;
import io.squid.cynapse.repositories.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private RoomService roomService;

    public List<Device> findAll() {
        return this.deviceRepository.findAll();
    }

    public List<Device> findByRoomId(Long roomId) {
        if (roomId == null) {
            return this.findAll();
        }
        return this.deviceRepository.findByRoomId(roomId);
    }

    public Device findById(long deviceId) {
        return this.deviceRepository.findById(deviceId).orElse(null);
    }

    public Device create(IoTDTO.DevicePayload payload) {
        Room room = this.roomService.findById(payload.roomId());
        if (room == null) {
            return null;
        }

        Device device = new Device(payload.name(), payload.type(), room);
        device.setStatus(payload.status() == null ? DeviceStatus.ONLINE : payload.status());
        device.setLastSeenAt(LocalDateTime.now());
        return this.deviceRepository.save(device);
    }

    public Device update(IoTDTO.DevicePayload payload) {
        if (payload.id() == null) {
            return null;
        }

        Device device = this.findById(payload.id());
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
        return this.deviceRepository.save(device);
    }

    public boolean delete(long deviceId) {
        Device device = this.findById(deviceId);
        if (device == null) {
            return false;
        }

        this.deviceRepository.delete(device);
        return true;
    }

}


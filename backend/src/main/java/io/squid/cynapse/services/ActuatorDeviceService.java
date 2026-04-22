package io.squid.cynapse.services;

import io.squid.cynapse.dto.DeviceDTO;
import io.squid.cynapse.entities.ActuatorDevice;
import io.squid.cynapse.entities.Room;
import io.squid.cynapse.enums.DeviceStatus;
import io.squid.cynapse.repositories.ActuatorDeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActuatorDeviceService {

    @Autowired
    private ActuatorDeviceRepository actuatorDeviceRepository;

    @Autowired
    private RoomService roomService;

    public List<ActuatorDevice> findAll() {
        return this.actuatorDeviceRepository.findAll();
    }

    public List<ActuatorDevice> findByRoomId(Long roomId) {
        if (roomId == null) {
            return this.findAll();
        }

        return this.actuatorDeviceRepository.findByRoomId(roomId);
    }

    public ActuatorDevice findById(long deviceId) {
        return this.actuatorDeviceRepository.findById(deviceId).orElse(null);
    }

    public ActuatorDevice create(DeviceDTO.ActuatorDevicePayload payload) {
        if (payload == null || payload.type() == null || payload.type().isSensor()) {
            return null;
        }

        Room room = this.roomService.findById(payload.roomId());
        if (room == null) {
            return null;
        }

        ActuatorDevice device = new ActuatorDevice(payload.name(), room, payload.type(), payload.currentState());
        device.setStatus(payload.status() == null ? DeviceStatus.ONLINE : payload.status());
        return this.actuatorDeviceRepository.save(device);
    }

    public ActuatorDevice update(DeviceDTO.ActuatorDevicePayload payload) {
        if (payload == null || payload.id() == null || payload.type() == null || payload.type().isSensor()) {
            return null;
        }

        ActuatorDevice device = this.findById(payload.id());
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
        device.setCurrentState(payload.currentState());
        device.setRoom(room);
        return this.actuatorDeviceRepository.save(device);
    }

    public boolean delete(long deviceId) {
        ActuatorDevice device = this.findById(deviceId);
        if (device == null) {
            return false;
        }

        this.actuatorDeviceRepository.delete(device);
        return true;
    }
}


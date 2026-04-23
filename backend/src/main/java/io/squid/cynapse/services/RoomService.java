package io.squid.cynapse.services;

import io.squid.cynapse.dto.DeviceDTO;
import io.squid.cynapse.entities.*;
import io.squid.cynapse.enums.*;
import io.squid.cynapse.repositories.ActuatorDeviceRepository;
import io.squid.cynapse.repositories.RoomRepository;
import io.squid.cynapse.repositories.SensorDeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private SensorDeviceRepository sensorDeviceRepository;

    @Autowired
    private ActuatorDeviceRepository actuatorDeviceRepository;

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
        Room savedRoom = this.roomRepository.save(room);
        this.createDefaultDevice(savedRoom);
        return savedRoom;
    }

    public void createDefaultDevice(Room room) {
        //create temp ceo population device
        this.sensorDeviceRepository.save(new SensorDevice("Temperature Sensor", room, DeviceType.THERMOMETER));
        this.sensorDeviceRepository.save(new SensorDevice("CO2 Sensor", room, DeviceType.CO2_SENSOR));
        this.sensorDeviceRepository.save(new SensorDevice("Occupancy Sensor", room, DeviceType.PEOPLE_COUNTER));

        ActuatorDevice actuatorDevice = new ActuatorDevice("Smart Light", room, DeviceType.SMART_LIGHT, "OFF");

        AutomationRule automationRule = new AutomationRule(actuatorDevice, "OFF", AutomationLogicalOperator.AND, 20, true);
        AutomationCondition offCondition = new AutomationCondition(automationRule, AutomationConditionType.SENSOR_VALUE, DeviceType.PEOPLE_COUNTER, ComparisonOperator.LTE, 0.0, 0, 0);
        automationRule.setConditions(new ArrayList<>(List.of(offCondition)));

        AutomationRule automationRuleOn = new AutomationRule(actuatorDevice, "ON", AutomationLogicalOperator.AND, 20, true);
        AutomationCondition onCondition = new AutomationCondition(automationRuleOn, AutomationConditionType.SENSOR_VALUE, DeviceType.PEOPLE_COUNTER, ComparisonOperator.GT, 0.0, 0, 0);
        automationRuleOn.setConditions(new ArrayList<>(List.of(onCondition)));

        actuatorDevice.getAutomationRules().add(automationRule);
        actuatorDevice.getAutomationRules().add(automationRuleOn);
        this.actuatorDeviceRepository.save(actuatorDevice);
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


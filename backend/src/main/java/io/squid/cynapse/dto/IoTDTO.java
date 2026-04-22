package io.squid.cynapse.dto;

import io.squid.cynapse.entities.Alert;
import io.squid.cynapse.entities.Device;
import io.squid.cynapse.entities.Room;
import io.squid.cynapse.enums.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class IoTDTO {

    public record RoomPayload(Long id, String name, int floorNumber, int capacity) {
    }

    public record DevicePayload(Long id, String name, DeviceType type, DeviceStatus status, Long roomId) {
    }


    public record DeviceView(Long id, String name, DeviceType type, DeviceStatus status, double lastValue, List<AlertView> alertViews, LocalDateTime lastSeenAt) {

        public static DeviceView toView(Device device, double lastValue, List<AlertView> alertViews) {
            return new DeviceView(device.getId(), device.getName(), device.getType(), device.getStatus(), lastValue, alertViews, device.getLastSeenAt());
        }

    }

    public record ReadingView(Long id, Long deviceId, String metric, double value, LocalDateTime capturedAt) {

        public static ReadingView toView(io.squid.cynapse.entities.SensorReading reading) {
            return new ReadingView(reading.getId(), reading.getDevice().getId(), reading.getMetric(), reading.getValue(), reading.getCapturedAt());
        }

    }

    public record AlertView(Long id, String roomName, String deviceName, AlertSeverity severity, String message, LocalDateTime createdAt, LocalDateTime resolvedAt) {

        public static AlertView toView(Alert alert) {
            return new AlertView(alert.getId(), alert.getDevice().getRoom().getName(), alert.getDevice().getName(), alert.getSeverity(), alert.getMessage(), alert.getCreatedAt(), alert.getResolvedAt());
        }

    }

    public record RoomSnapshotView(String name, int floorNumber, int capacity, List<DeviceView> devices) {

        public static RoomSnapshotView toView(Room room, List<DeviceView> devices) {
            return new RoomSnapshotView(room.getName(), room.getFloorNumber(), room.getCapacity(), devices);
        }

    }

    public record OverviewView(long roomsTotal, long roomsOccupied, long roomsInAlert, long activeAlerts, double avgTemperature) {
    }
}


package io.squid.cynapse.services;

import io.squid.cynapse.dto.IoTDTO;
import io.squid.cynapse.entities.Alert;
import io.squid.cynapse.entities.Device;
import io.squid.cynapse.entities.Room;
import io.squid.cynapse.entities.SensorReading;
import io.squid.cynapse.enums.DeviceType;
import io.squid.cynapse.enums.RoomStatus;
import io.squid.cynapse.repositories.AlertRepository;
import io.squid.cynapse.repositories.DeviceRepository;
import io.squid.cynapse.repositories.RoomRepository;
import io.squid.cynapse.repositories.SensorReadingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MonitoringService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private SensorReadingRepository sensorReadingRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private RoomService roomService;

    public IoTDTO.OverviewView getOverview() {
        List<Room> rooms = this.roomRepository.findAll();
        List<Alert> activeAlerts = this.alertRepository.findByResolvedAtIsNullOrderByCreatedAtDesc();

        long occupied = rooms.stream().filter(room -> room.getStatus() == RoomStatus.OCCUPIED).count();
        long inAlert = rooms.stream().filter(room -> room.getStatus() == RoomStatus.ALERT).count();

        double avgTemp = this.getLatestTemperatureAverage();

        return new IoTDTO.OverviewView(
                rooms.size(),
                occupied,
                inAlert,
                activeAlerts.size(),
                avgTemp
        );
    }

    public IoTDTO.RoomSnapshotView getRoomSnapshot(long roomId) {
        Room room = this.roomRepository.findById(roomId).orElse(null);
        if (room == null) {
            return null;
        }

        List<Device> devices = this.deviceRepository.findByRoomId(roomId);

        List<IoTDTO.DeviceView> deviceViews = new ArrayList<>();
        for (Device device : devices) {
            deviceViews.add(this.getDeviceView(device.getId()));
        }

        return IoTDTO.RoomSnapshotView.toView(room, deviceViews);
    }

    public List<IoTDTO.ReadingView> getDeviceHistory(long deviceId, int limit) {
        List<SensorReading> readings = this.sensorReadingRepository.findTop200ByDeviceIdOrderByCapturedAtDesc(deviceId);
        if (limit <= 0 || limit >= readings.size()) {
            return readings.stream().map(IoTDTO.ReadingView::toView).toList();
        }

        return readings.subList(0, limit).stream().map(IoTDTO.ReadingView::toView).toList();
    }

    public IoTDTO.DeviceView getDeviceView(long deviceId) {
        Device device = this.deviceRepository.findById(deviceId).orElse(null);
        if (device == null) return null;

        double value = this.sensorReadingRepository.findFirstByDeviceIdOrderByCapturedAtDesc(deviceId).map(SensorReading::getValue).orElse(0.0);

        List<IoTDTO.AlertView> activeAlert = this.alertRepository.findByDeviceIdAndResolvedAtIsNullOrderByCreatedAtDesc(deviceId).stream().map(IoTDTO.AlertView::toView).toList();

        return IoTDTO.DeviceView.toView(device, value, activeAlert);
    }

    public List<IoTDTO.AlertView> getActiveAlerts() {
        return this.alertRepository.findByResolvedAtIsNullOrderByCreatedAtDesc().stream().map(IoTDTO.AlertView::toView).toList();
    }

    private double getLatestTemperatureAverage() {
        List<Device> tempDevices = this.deviceRepository.findAll().stream().filter(device -> DeviceType.THERMOMETER.equals(device.getType())).toList();
        if (tempDevices.isEmpty()) {
            return 0;
        }

        double sum = 0;
        int count = 0;
        for (Device device : tempDevices) {
            Optional<SensorReading> latest = this.sensorReadingRepository.findFirstByDeviceIdOrderByCapturedAtDesc(device.getId());
            if (latest.isPresent()) {
                sum += latest.get().getValue();
                count++;
            }
        }

        if (count == 0) {
            return 0;
        }

        return Math.round(sum / count);
    }
}


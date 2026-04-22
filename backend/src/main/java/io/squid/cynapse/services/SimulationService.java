package io.squid.cynapse.services;

import io.squid.cynapse.entities.Alert;
import io.squid.cynapse.entities.Device;
import io.squid.cynapse.entities.Room;
import io.squid.cynapse.entities.SensorReading;
import io.squid.cynapse.enums.AlertSeverity;
import io.squid.cynapse.enums.DeviceStatus;
import io.squid.cynapse.enums.DeviceType;
import io.squid.cynapse.enums.RoomStatus;
import io.squid.cynapse.repositories.AlertRepository;
import io.squid.cynapse.repositories.DeviceRepository;
import io.squid.cynapse.repositories.RoomRepository;
import io.squid.cynapse.repositories.SensorReadingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class SimulationService {

    private final Random random = new Random();

    @Value("${cynapse.simulation.enabled:true}")
    private boolean enabled;

    @Value("${cynapse.simulation.temperature.min:17}")
    private double temperatureMin;

    @Value("${cynapse.simulation.temperature.max:28}")
    private double temperatureMax;

    @Value("${cynapse.simulation.co2.max:1200}")
    private double maxCo2;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private SensorReadingRepository sensorReadingRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Scheduled(fixedDelayString = "${cynapse.simulation.interval-ms:5000}")
    public void runTick() {
        List<Room> rooms = this.roomRepository.findAll();

        for (Room room : rooms) {
            List<Device> devices = this.deviceRepository.findByRoomId(room.getId());
            if (devices.isEmpty()) {
                continue;
            }

            for (Device device : devices) {
                if (!device.getStatus().equals(DeviceStatus.ONLINE)) {
                    continue;
                }

                double lastValue = this.sensorReadingRepository.findFirstByDeviceIdOrderByCapturedAtDesc(device.getId()).map(SensorReading::getValue).orElse(0.0);
                SensorReading reading = this.buildReading(room, device, lastValue, device.getLastSeenAt());
                if (reading == null) continue;
                device.setLastSeenAt(LocalDateTime.now());
                this.deviceRepository.save(device);

                if (lastValue == reading.getValue()) continue;
                this.sensorReadingRepository.save(reading);

                this.updateAlerts(room, device, reading);
            }

            this.updateRoomStatus(room);
        }
    }


    private SensorReading buildReading(Room room, Device device, double lastValue, LocalDateTime lastView) {
        return switch (device.getType()) {
            case THERMOMETER -> {
                double temp = 20 + this.randomRange(-1.2, 1.2);
                yield new SensorReading(device, "temperature", round(temp));
            }
            case PEOPLE_COUNTER ->
                    new SensorReading(device, "people_count", this.simulatePeople(room.getCapacity(), lastValue));
            case CO2_SENSOR -> {
                double co2 = 500 + this.randomRange(-30, 30);
                yield new SensorReading(device, "co2", round(co2));
            }
            case HUMIDITY_SENSOR -> {
                double humidity = 40 + this.randomRange(-5, 5);
                yield new SensorReading(device, "humidity", round(humidity));
            }
            case SMART_LIGHT -> {
                double population = this.sensorReadingRepository.findFirstByDeviceRoomIdAndDeviceTypeOrderByCapturedAtDesc(room.getId(), DeviceType.PEOPLE_COUNTER).map(SensorReading::getValue).orElse(0.0);
                if (population > 0) {
                    yield new SensorReading(device, "light_status", 1);
                } else {
                    yield new SensorReading(device, "light_status", 0);
                }
            }
            default -> {
                yield null;
            }
        };
    }

    private int simulatePeople(int capacity, double lastValue) {
        if (capacity <= 0) {
            return 0;
        }

        int currentHour = LocalDateTime.now().getHour();
        int maxForHour = (currentHour >= 8 && currentHour <= 18) ? (capacity + 3) : Math.max(1, (capacity + 4) / 5);
        int change = this.random.nextInt(7) - 3; // -3 to +3
        int newValue = (int) lastValue + change;
        newValue = Math.max(0, newValue);
        newValue = Math.min(maxForHour, newValue);
        return newValue;
    }

    private void updateRoomStatus(Room room) {
        Optional<SensorReading> populationReading = this.sensorReadingRepository.findFirstByDeviceRoomIdAndDeviceTypeOrderByCapturedAtDesc(room.getId(), DeviceType.PEOPLE_COUNTER);
        boolean occupied = populationReading.map(reading -> reading.getValue() > 0).orElse(false);

        Optional<Alert> activeAlert = this.alertRepository.findFirstByDeviceRoomIdAndResolvedAtIsNull(room.getId());

        if (activeAlert.isPresent()) {
            room.setStatus(RoomStatus.ALERT);
        } else if (occupied) {
            room.setStatus(RoomStatus.OCCUPIED);
        } else {
            room.setStatus(RoomStatus.FREE);
        }

        this.roomRepository.save(room);
    }

    private void updateAlerts(Room room, Device device, SensorReading sensorReading) {
        if (device.getType().equals(DeviceType.THERMOMETER)) {
            if (sensorReading.getValue() > this.temperatureMax) {
                this.openAlert(device, AlertSeverity.MEDIUM, "High temperature detected: " + sensorReading.getValue() + "°C", sensorReading.getCapturedAt());
            } else if (sensorReading.getValue() < this.temperatureMin) {
                this.openAlert(device, AlertSeverity.MEDIUM, "Low temperature detected: " + sensorReading.getValue() + "°C", sensorReading.getCapturedAt());
            } else {
                this.resolveAlert(device, sensorReading.getCapturedAt());
            }
        }

        if (device.getType().equals(DeviceType.CO2_SENSOR)) {
            if (sensorReading.getValue() > this.maxCo2) {
                this.openAlert(device, AlertSeverity.HIGH, "High CO2 level detected: " + sensorReading.getValue() + " ppm", sensorReading.getCapturedAt());
            } else {
                this.resolveAlert(device, sensorReading.getCapturedAt());
            }
        }

        if (device.getType().equals(DeviceType.HUMIDITY_SENSOR)) {
            if (sensorReading.getValue() > 70) {
                this.openAlert(device, AlertSeverity.MEDIUM, "High humidity detected: " + sensorReading.getValue() + "%", sensorReading.getCapturedAt());
            } else if (sensorReading.getValue() < 30) {
                this.openAlert(device, AlertSeverity.MEDIUM, "Low humidity detected: " + sensorReading.getValue() + "%", sensorReading.getCapturedAt());
            } else {
                this.resolveAlert(device, sensorReading.getCapturedAt());
            }
        }

        if (device.getType().equals(DeviceType.PEOPLE_COUNTER)) {
            if (sensorReading.getValue() > room.getCapacity()) {
                this.openAlert(device, AlertSeverity.HIGH, "Room overcapacity detected: " + sensorReading.getValue() + " people", sensorReading.getCapturedAt());
            } else {
                this.resolveAlert(device, sensorReading.getCapturedAt());
            }
        }
    }

    private void openAlert(Device device, AlertSeverity severity, String message, LocalDateTime now) {
        if (this.alertRepository.findFirstByDeviceIdAndResolvedAtIsNull(device.getId()).isPresent()) {
            return;
        }

        Alert alert = new Alert(device, severity, message, now);
        this.alertRepository.save(alert);
    }

    private void resolveAlert(Device device, LocalDateTime now) {
        this.alertRepository.findFirstByDeviceIdAndResolvedAtIsNull(device.getId()).ifPresent(alert -> {
            alert.setResolvedAt(now);
            this.alertRepository.save(alert);
        });
    }

    private double randomRange(double min, double max) {
        return min + (max - min) * this.random.nextDouble();
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}


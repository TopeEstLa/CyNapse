package io.squid.cynapse.services;

import io.squid.cynapse.entities.Room;
import io.squid.cynapse.entities.SensorDevice;
import io.squid.cynapse.entities.SensorReading;
import io.squid.cynapse.enums.DeviceStatus;
import io.squid.cynapse.enums.DeviceType;
import io.squid.cynapse.enums.RoomStatus;
import io.squid.cynapse.repositories.RoomRepository;
import io.squid.cynapse.repositories.SensorDeviceRepository;
import io.squid.cynapse.repositories.SensorReadingRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class SimulationService {

    private final Random random = new Random();
    private final Logger logger = LoggerFactory.getLogger(SimulationService.class);


    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private SensorDeviceRepository sensorDeviceRepository;

    @Autowired
    private SensorReadingRepository sensorReadingRepository;

    @Scheduled(fixedDelayString = "${cynapse.simulation.interval-ms:5000}")
    public void runTick() {
        List<Room> rooms = this.roomRepository.findAll();

        for (Room room : rooms) {
            List<SensorDevice> devices = this.sensorDeviceRepository.findByRoomId(room.getId());
            if (devices.isEmpty()) {
                continue;
            }

            for (SensorDevice device : devices) {
                if (!device.getStatus().equals(DeviceStatus.ONLINE)) {
                    continue;
                }

                double lastValue = this.sensorReadingRepository.findFirstByDeviceIdOrderByCapturedAtDesc(device.getId()).map(SensorReading::getValue).orElse(0.0);
                SensorReading reading = this.buildReading(room, device, lastValue, device.getLastSeenAt());
                if (reading == null) continue;
                device.setLastSeenAt(LocalDateTime.now());
                this.sensorDeviceRepository.save(device);

                this.sensorReadingRepository.save(reading);
            }

            this.updateRoomStatus(room);
        }
    }

    @Scheduled(initialDelay = 30, fixedRate = 30, timeUnit = TimeUnit.SECONDS)
    @Transactional
    public void cleanUpOldReadings() {
        this.logger.info("Starting cleanup of old sensor readings...");

        List<SensorDevice> devices = this.sensorDeviceRepository.findAll();

        for (SensorDevice device : devices) {
            List<SensorReading> topReadings = this.sensorReadingRepository.findTop200ByDeviceIdOrderByCapturedAtDesc(device.getId());

            if (topReadings.size() >= 200) {
                SensorReading oldestKeptReading = topReadings.get(topReadings.size() - 1);
                LocalDateTime threshold = oldestKeptReading.getCapturedAt();

                List<SensorReading> oldReadings = this.sensorReadingRepository.findByCapturedAtBefore(threshold).stream()
                        .filter(reading -> reading.getDevice().getId().equals(device.getId()))
                        .toList();

                if (!oldReadings.isEmpty()) {
                    List<Long> idsToDelete = oldReadings.stream()
                            .map(SensorReading::getId)
                            .toList();
                    this.logger.info("Deleting {} old readings for device {}", idsToDelete.size(), device.getId());
                    this.sensorReadingRepository.deleteByIdIn(idsToDelete);
                }
            }
        }
    }


    private SensorReading buildReading(Room room, SensorDevice device, double lastValue, LocalDateTime lastView) {
        return switch (device.getType()) {
            case THERMOMETER -> {
                double temp = lastValue + 1;
                if (lastValue > 30) {
                    temp = 2;
                }
                yield new SensorReading(device, Math.round(temp));
            }
            case PEOPLE_COUNTER -> new SensorReading(device, this.simulatePeople(room.getCapacity(), lastValue));
            case CO2_SENSOR -> {
                double co2 = 500 + this.randomRange(-30, 30);
                yield new SensorReading(device, Math.round(co2));
            }
            case HUMIDITY_SENSOR -> {
                double humidity = 40 + this.randomRange(-5, 5);
                yield new SensorReading(device, Math.round(humidity));
            }
            case SMART_LIGHT -> {
                double population = this.sensorReadingRepository.findFirstByDeviceRoomIdAndDeviceTypeOrderByCapturedAtDesc(room.getId(), DeviceType.PEOPLE_COUNTER).map(SensorReading::getValue).orElse(0.0);
                if (population > 0) {
                    yield new SensorReading(device, 1);
                } else {
                    yield new SensorReading(device, 0);
                }
            }
            default -> {
                yield null;
            }
        };
    }

    private double simulatePeople(int capacity, double lastValue) {
        if (capacity <= 0) {
            return 0;
        }

        int currentHour = LocalDateTime.now().getHour();
        if (currentHour >= 19 || currentHour < 8) {
            return 0;
        }


        if (lastValue > 0) { //lastValue = 30
            //33% chance to have 0 as new value
            double chance = this.randomRange(0, 100);
            if (chance < 33) {
                return 0;
            } else {
                return 30;
            }
        } else { //lastValue = 0
            // 33 % chance to have 30 as new value
            double chance = this.randomRange(0, 100);
            if (chance < 33) {
                return 30;
            } else {
                return 0;
            }
        }
    }

    private void updateRoomStatus(Room room) {
        Optional<SensorReading> populationReading = this.sensorReadingRepository.findFirstByDeviceRoomIdAndDeviceTypeOrderByCapturedAtDesc(room.getId(), DeviceType.PEOPLE_COUNTER);
        boolean occupied = populationReading.map(reading -> reading.getValue() > 0).orElse(false);

      if (occupied) {
            room.setStatus(RoomStatus.OCCUPIED);
        } else {
            room.setStatus(RoomStatus.FREE);
        }

        this.roomRepository.save(room);
    }

    private double randomRange(double min, double max) {
        return min + (max - min) * this.random.nextDouble();
    }
}


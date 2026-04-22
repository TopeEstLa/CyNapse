package io.squid.cynapse;

import io.squid.cynapse.repositories.DeviceRepository;
import io.squid.cynapse.repositories.RoomRepository;
import io.squid.cynapse.repositories.SensorReadingRepository;
import io.squid.cynapse.services.SimulationService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SimulationServiceTests {

    @Autowired
    private SimulationService simulationService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private SensorReadingRepository sensorReadingRepository;

    @Test
    void seedAndTickGenerateData() {
        this.simulationService.reset();
        this.simulationService.seedDefaultData();
        this.simulationService.runTick();

        Assertions.assertTrue(this.roomRepository.findAll().size() >= 3);
        Assertions.assertTrue(this.deviceRepository.findAll().size() >= 12);
        Assertions.assertFalse(this.sensorReadingRepository.findAll().isEmpty());
    }
}


package io.squid.cynapse.repositories;

import io.squid.cynapse.entities.SensorReading;
import io.squid.cynapse.enums.DeviceType;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SensorReadingRepository extends CrudRepository<SensorReading, Long> {

    List<SensorReading> findAll();

    Optional<SensorReading> findFirstByDeviceIdOrderByCapturedAtDesc(Long deviceId);

    Optional<SensorReading> findFirstByDeviceRoomIdAndDeviceTypeOrderByCapturedAtDesc(Long roomId, DeviceType type);

    List<SensorReading> findTop200ByDeviceIdOrderByCapturedAtDesc(Long deviceId);

    List<SensorReading> findByCapturedAtBefore(LocalDateTime threshold);
}


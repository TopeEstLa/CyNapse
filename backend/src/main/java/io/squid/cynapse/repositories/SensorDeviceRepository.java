package io.squid.cynapse.repositories;

import io.squid.cynapse.entities.SensorDevice;
import io.squid.cynapse.enums.DeviceStatus;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorDeviceRepository extends CrudRepository<SensorDevice, Long> {

    List<SensorDevice> findAll();

    List<SensorDevice> findByRoomId(Long roomId);

    List<SensorDevice> findByStatus(DeviceStatus status);
}


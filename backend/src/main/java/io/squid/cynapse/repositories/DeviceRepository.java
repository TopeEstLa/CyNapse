package io.squid.cynapse.repositories;

import io.squid.cynapse.entities.Device;
import io.squid.cynapse.enums.DeviceStatus;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends CrudRepository<Device, Long> {

    List<Device> findAll();

    List<Device> findByRoomId(Long roomId);

    List<Device> findByStatus(DeviceStatus status);
}


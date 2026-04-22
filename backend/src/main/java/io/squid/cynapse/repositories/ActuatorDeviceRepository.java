package io.squid.cynapse.repositories;

import io.squid.cynapse.entities.ActuatorDevice;
import io.squid.cynapse.enums.DeviceStatus;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * @author TopeEstLa
 */
public interface ActuatorDeviceRepository extends CrudRepository<ActuatorDevice, Long> {

    List<ActuatorDevice> findAll();

    List<ActuatorDevice> findByRoomId(Long roomId);

    List<ActuatorDevice> findByStatus(DeviceStatus status);


}

package io.squid.cynapse.repositories;

import io.squid.cynapse.entities.ActuatorHistory;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * @author TopeEstLa
 */
public interface ActuatorHistoryRepository extends CrudRepository<ActuatorHistory, Long> {

    List<ActuatorHistory> findAll();

    List<ActuatorHistory> findTop200ByDeviceIdOrderByCreatedAtDesc(Long deviceId);


}

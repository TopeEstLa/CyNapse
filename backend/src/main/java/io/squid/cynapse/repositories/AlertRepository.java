package io.squid.cynapse.repositories;

import io.squid.cynapse.entities.Alert;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlertRepository extends CrudRepository<Alert, Long> {

    List<Alert> findAll();

    List<Alert> findByDeviceIdAndResolvedAtIsNullOrderByCreatedAtDesc(Long deviceId);

    List<Alert> findByResolvedAtIsNullOrderByCreatedAtDesc();

    Optional<Alert> findFirstByDeviceIdAndResolvedAtIsNull(Long deviceId);

    Optional<Alert> findFirstByDeviceRoomIdAndResolvedAtIsNull(Long roomId);

    long deleteByDeviceId(Long deviceId);
}


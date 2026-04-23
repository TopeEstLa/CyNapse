package io.squid.cynapse.repositories;

import io.squid.cynapse.entities.AutomationRule;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface AutomationRuleRepository extends CrudRepository<AutomationRule, Long> {

    @EntityGraph(attributePaths = {"conditions", "actuatorDevice", "actuatorDevice.room"})
    List<AutomationRule> findAll();

    @EntityGraph(attributePaths = {"conditions", "actuatorDevice", "actuatorDevice.room"})
    List<AutomationRule> findByActuatorDeviceId(Long actuatorDeviceId);

    @EntityGraph(attributePaths = {"conditions", "actuatorDevice", "actuatorDevice.room"})
    List<AutomationRule> findByEnabledTrueOrderByIdAsc();

    @EntityGraph(attributePaths = {"conditions", "actuatorDevice", "actuatorDevice.room"})
    Optional<AutomationRule> findById(Long id);
}


package io.squid.cynapse.repositories;

import io.squid.cynapse.entities.AutomationRule;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface AutomationRuleRepository extends CrudRepository<AutomationRule, Long> {

    List<AutomationRule> findAll();

    List<AutomationRule> findByActuatorDeviceId(Long actuatorDeviceId);

    List<AutomationRule> findByEnabledTrueOrderByIdAsc();

    Optional<AutomationRule> findById(Long id);
}


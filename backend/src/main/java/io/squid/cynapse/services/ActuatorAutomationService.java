package io.squid.cynapse.services;

import io.squid.cynapse.entities.*;
import io.squid.cynapse.enums.AutomationConditionType;
import io.squid.cynapse.enums.AutomationLogicalOperator;
import io.squid.cynapse.enums.ComparisonOperator;
import io.squid.cynapse.repositories.ActuatorDeviceRepository;
import io.squid.cynapse.repositories.ActuatorHistoryRepository;
import io.squid.cynapse.repositories.AutomationRuleRepository;
import io.squid.cynapse.repositories.SensorReadingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author TopeEstLa
 */
@Service
public class ActuatorAutomationService {

    @Autowired
    private AutomationRuleRepository automationRuleRepository;

    @Autowired
    private ActuatorDeviceRepository actuatorDeviceRepository;

    @Autowired
    private SensorReadingRepository sensorReadingRepository;

    @Autowired
    private ActuatorHistoryRepository actuatorHistoryRepository;

    @Value("${cynapse.automation.enabled:true}")
    private boolean enabled;

    @Scheduled(fixedDelayString = "${cynapse.automation.engine-tick-ms:1000}")
    @Transactional
    public void runAutomationTick() {
        if (!this.enabled) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        List<AutomationRule> rules = this.automationRuleRepository.findByEnabledTrueOrderByIdAsc();

        for (AutomationRule rule : rules) {
            this.evaluateAndApply(rule, now, false);
        }
    }

    @Transactional
    public void evaluateAndApply(AutomationRule rule, LocalDateTime now, boolean forceRun) {
        if (!forceRun && !this.isInCooldown(rule, now)) {
            return;
        }

        boolean matched = this.evaluateRule(rule, now);
        rule.setLastEvaluationAt(now);

        if (!matched) {
            return;
        }

        ActuatorDevice actuator = rule.getActuatorDevice();
        String targetState = rule.getTargetState();
        if (targetState.equals(actuator.getCurrentState())) {
            return;
        }

        actuator.setCurrentState(targetState);
        this.actuatorDeviceRepository.save(actuator);
        this.actuatorHistoryRepository.save(new ActuatorHistory(actuator, targetState));
    }

    private boolean isInCooldown(AutomationRule rule, LocalDateTime now) {
        LocalDateTime lastEvaluationAt = rule.getLastEvaluationAt();
        if (lastEvaluationAt == null) {
            return true;
        }

        return !lastEvaluationAt.plusSeconds(rule.getIntervalSeconds()).isAfter(now);
    }

    private boolean evaluateRule(AutomationRule rule, LocalDateTime now) {
        if (rule.getConditions().isEmpty()) {
            return false;
        }

        List<Boolean> evaluations = new ArrayList<>();
        Long roomId = rule.getActuatorDevice().getRoom().getId();
        for (AutomationCondition condition : rule.getConditions()) {
            evaluations.add(this.evaluateCondition(condition, roomId, now));
        }

        if (rule.getLogicalOperator() == AutomationLogicalOperator.OR) {
            return evaluations.stream().anyMatch(Boolean::booleanValue);
        }

        return evaluations.stream().allMatch(Boolean::booleanValue);
    }

    private boolean evaluateCondition(AutomationCondition condition, Long roomId, LocalDateTime now) {
        if (condition.getType() == AutomationConditionType.HOUR_RANGE) {
            return this.evaluateHourRange(condition, now.getHour());
        }

        if (condition.getType() == AutomationConditionType.SENSOR_VALUE) {
            Optional<SensorReading> latestReading = this.sensorReadingRepository
                    .findFirstByDeviceRoomIdAndDeviceTypeOrderByCapturedAtDesc(roomId, condition.getSensorType());

            if (latestReading.isEmpty()) {
                return false;
            }

            return this.compare(latestReading.get().getValue(), condition.getComparisonOperator(), condition.getThresholdValue());
        }

        return false;
    }

    private boolean evaluateHourRange(AutomationCondition condition, int currentHour) {
        int start = condition.getStartHour();
        int end = condition.getEndHour();

        if (start <= end) {
            return currentHour >= start && currentHour <= end;
        }

        // Handles ranges that cross midnight,  22 -> 6.
        return currentHour >= start || currentHour <= end;
    }

    private boolean compare(double sensorValue, ComparisonOperator operator, double thresholdValue) {
        return switch (operator) {
            case LT -> sensorValue < thresholdValue;
            case LTE -> sensorValue <= thresholdValue;
            case GT -> sensorValue > thresholdValue;
            case GTE -> sensorValue >= thresholdValue;
            case EQ -> Double.compare(sensorValue, thresholdValue) == 0;
            case NEQ -> Double.compare(sensorValue, thresholdValue) != 0;
        };
    }
}

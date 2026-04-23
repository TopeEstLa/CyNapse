package io.squid.cynapse.services;

import io.squid.cynapse.dto.AutomationDTO;
import io.squid.cynapse.entities.*;
import io.squid.cynapse.enums.AutomationConditionType;
import io.squid.cynapse.enums.AutomationLogicalOperator;
import io.squid.cynapse.enums.ComparisonOperator;
import io.squid.cynapse.enums.DeviceType;
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

@Service
public class AutomationRuleService {


    @Autowired
    private AutomationRuleRepository automationRuleRepository;

    @Autowired
    private ActuatorDeviceRepository actuatorDeviceRepository;

    @Autowired
    private SensorReadingRepository sensorReadingRepository;

    @Autowired
    private ActuatorHistoryRepository actuatorHistoryRepository;

    @Autowired
    private ActuatorAutomationService actuatorAutomationService;

    public List<AutomationDTO.RuleResponse> findAll(Long actuatorDeviceId) {
        if (actuatorDeviceId == null) return List.of();

        List<AutomationRule> rules = this.automationRuleRepository.findByActuatorDeviceId(actuatorDeviceId);

        return rules.stream().map(this::toResponse).toList();
    }

    public AutomationDTO.RuleResponse findById(Long ruleId) {
        AutomationRule rule = this.automationRuleRepository.findById(ruleId).orElse(null);
        if (rule == null) {
            return null;
        }

        return this.toResponse(rule);
    }

    public AutomationDTO.RuleResponse create(AutomationDTO.RulePayload payload) {
        String validationError = this.validatePayload(payload, false);
        if (validationError != null) {
            return null;
        }

        ActuatorDevice actuator = this.actuatorDeviceRepository.findById(payload.actuatorDeviceId()).orElse(null);
        if (actuator == null || actuator.getType().isSensor()) {
            return null;
        }

        AutomationRule rule = new AutomationRule(
                actuator,
                payload.targetState(),
                payload.logicalOperator() == null ? AutomationLogicalOperator.AND : payload.logicalOperator(),
                payload.intervalSeconds() == null ? 5 : payload.intervalSeconds(),
                payload.enabled() == null || payload.enabled());

        List<AutomationCondition> conditions = this.buildCondition(rule, payload.conditions());
        rule.getConditions().addAll(conditions);

        rule.setActuatorDevice(actuator);

        AutomationRule savedRule = this.automationRuleRepository.save(rule);
        return this.toResponse(savedRule);
    }

    public AutomationDTO.RuleResponse update(AutomationDTO.RulePayload payload) {
        String validationError = this.validatePayload(payload, true);
        if (validationError != null) {
            return null;
        }

        AutomationRule rule = this.automationRuleRepository.findById(payload.id()).orElse(null);
        if (rule == null) {
            return null;
        }

        if (!rule.getActuatorDevice().getId().equals(payload.actuatorDeviceId())) {
            ActuatorDevice actuator = this.actuatorDeviceRepository.findById(payload.actuatorDeviceId()).orElse(null);
            if (actuator == null || actuator.getType().isSensor()) {
                return null;
            }
            rule.setActuatorDevice(actuator);
        }

        rule.setTargetState(payload.targetState());
        if (payload.logicalOperator() != null) {
            rule.setLogicalOperator(payload.logicalOperator());
        }
        if (payload.intervalSeconds() != null) {
            rule.setIntervalSeconds(payload.intervalSeconds());
        }

        if (payload.enabled() != null) {
            rule.setEnabled(payload.enabled());
        }

        if (payload.conditions() != null && !payload.conditions().isEmpty()) {
            rule.getConditions().clear();
            List<AutomationCondition> conditions = this.buildCondition(rule, payload.conditions());
            rule.getConditions().addAll(conditions);
        }

        AutomationRule savedRule = this.automationRuleRepository.save(rule);
        return this.toResponse(savedRule);
    }

    public boolean delete(Long ruleId) {
        Optional<AutomationRule> existingRule = this.automationRuleRepository.findById(ruleId);
        if (existingRule.isEmpty()) {
            return false;
        }

        this.automationRuleRepository.delete(existingRule.get());
        return true;
    }

    public AutomationDTO.RuleResponse evaluateNow(Long ruleId) {
        AutomationRule rule = this.automationRuleRepository.findById(ruleId).orElse(null);
        if (rule == null) {
            return null;
        }

        this.actuatorAutomationService.evaluateAndApply(rule, LocalDateTime.now(), true);
        AutomationRule savedRule = this.automationRuleRepository.save(rule);
        return this.toResponse(savedRule);
    }

    private List<AutomationCondition> buildCondition(AutomationRule rule, List<AutomationDTO.RuleConditionPayload> conditionPayloads) {

        List<AutomationCondition> conditions = new ArrayList<>();
        for (AutomationDTO.RuleConditionPayload ruleConditionPayload : conditionPayloads) {
            conditions.add(new AutomationCondition(
                    rule,
                    ruleConditionPayload.type(),
                    ruleConditionPayload.sensorType(),
                    ruleConditionPayload.comparisonOperator(),
                    ruleConditionPayload.thresholdValue(),
                    ruleConditionPayload.startHourInclusive(),
                    ruleConditionPayload.endHourInclusive()
            ));
        }

        return conditions;
    }

    private String validatePayload(AutomationDTO.RulePayload payload, boolean update) {
        if (payload == null) {
            return "Payload is required";
        }

        if (update && payload.id() == null) {
            return "Rule id is required";
        }

        if (payload.actuatorDeviceId() == null) {
            return "actuatorDeviceId is required";
        }

        if (payload.targetState() == null || payload.targetState().isBlank()) {
            return "targetState is required";
        }

        if (payload.intervalSeconds() != null && payload.intervalSeconds() < 1) {
            return "intervalSeconds must be >= 1";
        }

        if (payload.conditions() == null || payload.conditions().isEmpty()) {
            return "At least one condition is required";
        }

        for (AutomationDTO.RuleConditionPayload condition : payload.conditions()) {
            if (condition.type() == null) {
                return "Condition type is required";
            }

            if (condition.type() == AutomationConditionType.SENSOR_VALUE) {
                if (condition.sensorType() == null || !condition.sensorType().isSensor()) {
                    return "SENSOR_VALUE requires a sensorType";
                }
                if (condition.comparisonOperator() == null || condition.thresholdValue() == null) {
                    return "SENSOR_VALUE requires comparisonOperator and thresholdValue";
                }
            }

            if (condition.type() == AutomationConditionType.HOUR_RANGE) {
                if (condition.startHourInclusive() == null || condition.endHourInclusive() == null) {
                    return "HOUR_RANGE requires startHourInclusive and endHourInclusive";
                }
                if (condition.startHourInclusive() < 0 || condition.startHourInclusive() > 23
                        || condition.endHourInclusive() < 0 || condition.endHourInclusive() > 23) {
                    return "Hours must be between 0 and 23";
                }
            }
        }

        return null;
    }

    private AutomationDTO.RuleResponse toResponse(AutomationRule rule) {
        List<AutomationDTO.RuleConditionResponse> conditionResponses = rule.getConditions().stream()
                .map(condition -> new AutomationDTO.RuleConditionResponse(
                        condition.getId(),
                        condition.getType(),
                        condition.getSensorType(),
                        condition.getComparisonOperator(),
                        condition.getThresholdValue(),
                        condition.getStartHour(),
                        condition.getEndHour()
                ))
                .toList();

        return new AutomationDTO.RuleResponse(
                rule.getId(),
                rule.getActuatorDevice().getId(),
                rule.getActuatorDevice().getName(),
                rule.getActuatorDevice().getRoom().getId(),
                rule.getTargetState(),
                rule.getLogicalOperator(),
                rule.getIntervalSeconds(),
                rule.isEnabled(),
                rule.getLastEvaluationAt(),
                conditionResponses
        );
    }
}


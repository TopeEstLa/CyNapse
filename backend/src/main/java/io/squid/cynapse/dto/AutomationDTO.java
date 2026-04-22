package io.squid.cynapse.dto;

import io.squid.cynapse.enums.AutomationConditionType;
import io.squid.cynapse.enums.AutomationLogicalOperator;
import io.squid.cynapse.enums.ComparisonOperator;
import io.squid.cynapse.enums.DeviceType;

import java.time.LocalDateTime;
import java.util.List;

public class AutomationDTO {

    public record RuleConditionPayload(
            Long id,
            AutomationConditionType type,
            DeviceType sensorType,
            ComparisonOperator comparisonOperator,
            Double thresholdValue,
            Integer startHourInclusive,
            Integer endHourInclusive
    ) {
    }

    public record RulePayload(
            Long id,
            Long actuatorDeviceId,
            String targetState,
            AutomationLogicalOperator logicalOperator,
            Integer intervalSeconds,
            Boolean enabled,
            List<RuleConditionPayload> conditions
    ) {
    }

    public record RuleConditionResponse(
            Long id,
            AutomationConditionType type,
            DeviceType sensorType,
            ComparisonOperator comparisonOperator,
            Double thresholdValue,
            Integer startHourInclusive,
            Integer endHourInclusive,
            int sequenceOrder
    ) {
    }

    public record RuleResponse(
            Long id,
            Long actuatorDeviceId,
            String actuatorName,
            Long roomId,
            String targetState,
            AutomationLogicalOperator logicalOperator,
            int intervalSeconds,
            boolean enabled,
            LocalDateTime lastEvaluationAt,
            List<RuleConditionResponse> conditions
    ) {
    }
}


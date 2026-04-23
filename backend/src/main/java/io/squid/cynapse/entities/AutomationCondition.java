package io.squid.cynapse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.squid.cynapse.enums.AutomationConditionType;
import io.squid.cynapse.enums.ComparisonOperator;
import io.squid.cynapse.enums.DeviceType;
import jakarta.persistence.*;

@Entity
public class AutomationCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rule_id", nullable = false)
    private AutomationRule rule;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AutomationConditionType type;

    @Enumerated(EnumType.STRING)
    private DeviceType sensorType;

    @Enumerated(EnumType.STRING)
    private ComparisonOperator comparisonOperator;

    private Double thresholdValue;

    private Integer startHour;

    private Integer endHour;

    public AutomationCondition() {
    }

    public AutomationCondition(AutomationRule rule, AutomationConditionType type, DeviceType sensorType, ComparisonOperator comparisonOperator, Double thresholdValue, Integer startHour, Integer endHour) {
        this.rule = rule;
        this.type = type;
        this.sensorType = sensorType;
        this.comparisonOperator = comparisonOperator;
        this.thresholdValue = thresholdValue;
        this.startHour = startHour;
        this.endHour = endHour;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AutomationRule getRule() {
        return rule;
    }

    public void setRule(AutomationRule rule) {
        this.rule = rule;
    }

    public AutomationConditionType getType() {
        return type;
    }

    public void setType(AutomationConditionType type) {
        this.type = type;
    }

    public DeviceType getSensorType() {
        return sensorType;
    }

    public void setSensorType(DeviceType sensorType) {
        this.sensorType = sensorType;
    }

    public ComparisonOperator getComparisonOperator() {
        return comparisonOperator;
    }

    public void setComparisonOperator(ComparisonOperator comparisonOperator) {
        this.comparisonOperator = comparisonOperator;
    }

    public Double getThresholdValue() {
        return thresholdValue;
    }

    public void setThresholdValue(Double thresholdValue) {
        this.thresholdValue = thresholdValue;
    }

    public Integer getStartHour() {
        return startHour;
    }

    public void setStartHour(Integer startHour) {
        this.startHour = startHour;
    }

    public Integer getEndHour() {
        return endHour;
    }

    public void setEndHour(Integer endHour) {
        this.endHour = endHour;
    }
}


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

    private Integer startHourInclusive;

    private Integer endHourInclusive;

    @Column(nullable = false)
    private int sequenceOrder;

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

    public Integer getStartHourInclusive() {
        return startHourInclusive;
    }

    public void setStartHourInclusive(Integer startHourInclusive) {
        this.startHourInclusive = startHourInclusive;
    }

    public Integer getEndHourInclusive() {
        return endHourInclusive;
    }

    public void setEndHourInclusive(Integer endHourInclusive) {
        this.endHourInclusive = endHourInclusive;
    }

    public int getSequenceOrder() {
        return sequenceOrder;
    }

    public void setSequenceOrder(int sequenceOrder) {
        this.sequenceOrder = sequenceOrder;
    }
}


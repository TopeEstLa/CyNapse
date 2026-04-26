package io.squid.cynapse.entities;

import io.squid.cynapse.enums.AutomationLogicalOperator;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class AutomationRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actuator_device_id", nullable = false)
    private ActuatorDevice actuatorDevice;

    @Column(nullable = false)
    private String targetState;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AutomationLogicalOperator logicalOperator;

    @Column(nullable = false)
    private int intervalSeconds;

    @Column(nullable = false)
    private boolean enabled;
    private LocalDateTime lastEvaluationAt;

    @OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<AutomationCondition> conditions = new ArrayList<>();


    public AutomationRule() {
    }

    public AutomationRule(ActuatorDevice actuatorDevice, String targetState, AutomationLogicalOperator logicalOperator, int intervalSeconds, boolean enabled) {
        this.actuatorDevice = actuatorDevice;
        this.targetState = targetState;
        this.logicalOperator = logicalOperator;
        this.intervalSeconds = intervalSeconds;
        this.enabled = enabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ActuatorDevice getActuatorDevice() {
        return actuatorDevice;
    }

    public void setActuatorDevice(ActuatorDevice actuatorDevice) {
        this.actuatorDevice = actuatorDevice;
    }

    public String getTargetState() {
        return targetState;
    }

    public void setTargetState(String targetState) {
        this.targetState = targetState;
    }

    public AutomationLogicalOperator getLogicalOperator() {
        return logicalOperator;
    }

    public void setLogicalOperator(AutomationLogicalOperator logicalOperator) {
        this.logicalOperator = logicalOperator;
    }

    public int getIntervalSeconds() {
        return intervalSeconds;
    }

    public void setIntervalSeconds(int intervalSeconds) {
        this.intervalSeconds = intervalSeconds;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public LocalDateTime getLastEvaluationAt() {
        return lastEvaluationAt;
    }

    public void setLastEvaluationAt(LocalDateTime lastEvaluationAt) {
        this.lastEvaluationAt = lastEvaluationAt;
    }

    public List<AutomationCondition> getConditions() {
        return conditions;
    }

    public void setConditions(List<AutomationCondition> conditions) {
        this.conditions.clear();
        if (conditions == null) {
            return;
        }

        for (AutomationCondition condition : conditions) {
            this.addCondition(condition);
        }
    }

    public void addCondition(AutomationCondition condition) {
        condition.setRule(this);
        this.conditions.add(condition);
    }
}


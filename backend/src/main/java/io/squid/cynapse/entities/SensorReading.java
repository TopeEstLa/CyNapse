package io.squid.cynapse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class SensorReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sensor_device_id", nullable = false)
    private SensorDevice device;

    @Column(nullable = false)
    private LocalDateTime capturedAt;

    @Column(nullable = false)
    private double value;

    public SensorReading() {
    }

    public SensorReading(SensorDevice device, double value) {
        this.device = device;
        this.capturedAt = LocalDateTime.now();
        this.value = value;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SensorDevice getDevice() {
        return device;
    }

    public void setDevice(SensorDevice device) {
        this.device = device;
    }

    public LocalDateTime getCapturedAt() {
        return capturedAt;
    }

    public void setCapturedAt(LocalDateTime capturedAt) {
        this.capturedAt = capturedAt;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }
}


package io.squid.cynapse.entities;

import io.squid.cynapse.enums.DeviceType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * @author TopeEstLa
 */
@Entity
public class SensorDevice extends Device {

    private LocalDateTime lastSeenAt;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SensorReading> readings = new ArrayList<>();

    public SensorDevice() {
    }

    public SensorDevice(String name, Room room, DeviceType type) {
        super(name, room, type);
    }

    public LocalDateTime getLastSeenAt() {
        return lastSeenAt;
    }

    public void setLastSeenAt(LocalDateTime lastSeenAt) {
        this.lastSeenAt = lastSeenAt;
    }

    public List<SensorReading> getReadings() {
        return readings;
    }

    public void setReadings(List<SensorReading> readings) {
        this.readings = readings;
    }

}

package io.squid.cynapse.entities;

import io.squid.cynapse.enums.DeviceType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;

/**
 * @author TopeEstLa
 */
@Entity
public class ActuatorDevice extends Device {

    private String currentState;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActuatorHistory> history = new ArrayList<>();


    public ActuatorDevice() {
    }

    public ActuatorDevice(String name, Room room, DeviceType type, String currentState) {
        super(name, room, type);
        this.currentState = currentState;
    }

    public String getCurrentState() {
        return currentState;
    }

    public void setCurrentState(String currentState) {
        this.currentState = currentState;
    }

    public List<ActuatorHistory> getHistory() {
        return history;
    }

    public void setHistory(List<ActuatorHistory> history) {
        this.history = history;
    }
}

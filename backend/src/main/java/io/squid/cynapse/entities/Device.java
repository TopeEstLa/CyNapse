package io.squid.cynapse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.squid.cynapse.enums.DeviceStatus;
import io.squid.cynapse.enums.DeviceType;
import jakarta.persistence.*;

@Entity
public abstract class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeviceType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeviceStatus status;


    public Device() {
        this.status = DeviceStatus.ONLINE;
    }

    public Device(String name, Room room, DeviceType type) {
        this.name = name;
        this.room = room;
        this.type = type;
        this.status = DeviceStatus.ONLINE;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DeviceType getType() {
        return type;
    }

    public void setType(DeviceType type) {
        this.type = type;
    }

    public DeviceStatus getStatus() {
        return status;
    }

    public void setStatus(DeviceStatus status) {
        this.status = status;
    }
}


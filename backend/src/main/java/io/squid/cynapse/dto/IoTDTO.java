package io.squid.cynapse.dto;

import io.squid.cynapse.enums.*;


public class IoTDTO {

    public record RoomPayload(Long id, String name, int floorNumber, int capacity) {
    }

    public record DevicePayload(Long id, String name, DeviceType type, DeviceStatus status, Long roomId) {
    }


}


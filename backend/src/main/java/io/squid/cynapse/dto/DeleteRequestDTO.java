package io.squid.cynapse.dto;

import io.squid.cynapse.enums.DeleteRequestDeviceType;

public class DeleteRequestDTO {

    public record CreatePayload(
            Long deviceId,
            DeleteRequestDeviceType deviceType
    ) {
    }


}


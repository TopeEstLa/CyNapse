package io.squid.cynapse.dto;

import io.squid.cynapse.enums.DeleteRequestDeviceType;
import io.squid.cynapse.enums.DeleteRequestStatus;

import java.time.LocalDateTime;

public class DeleteRequestDTO {

    public record CreatePayload(
            Long deviceId,
            DeleteRequestDeviceType deviceType
    ) {
    }


}


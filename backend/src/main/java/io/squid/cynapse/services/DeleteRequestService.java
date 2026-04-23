package io.squid.cynapse.services;

import io.squid.cynapse.dto.DeleteRequestDTO;
import io.squid.cynapse.entities.DeleteRequest;
import io.squid.cynapse.entities.User;
import io.squid.cynapse.enums.DeleteRequestDeviceType;
import io.squid.cynapse.enums.DeleteRequestStatus;
import io.squid.cynapse.repositories.DeleteRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeleteRequestService {

    @Autowired
    private DeleteRequestRepository deleteRequestRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private ActuatorDeviceService actuatorDeviceService;

    public List<DeleteRequest> findAll(DeleteRequestStatus status) {
        List<DeleteRequest> requests = status == null
                ? this.deleteRequestRepository.findAllByOrderByRequestedAtDesc()
                : this.deleteRequestRepository.findByStatusOrderByRequestedAtDesc(status);
        return requests;
    }

    public DeleteRequest findById(Long requestId) {
        if (requestId == null) {
            return null;
        }

        DeleteRequest request = this.deleteRequestRepository.findById(requestId).orElse(null);
        if (request == null) return null;


        return request;
    }

    public List<DeleteRequest> findMine() {
        User currentUser = this.userService.getCurrentUser();
        if (currentUser == null) {
            return List.of();
        }

        return this.deleteRequestRepository.findByRequesterIdOrderByRequestedAtDesc(currentUser.getId());
    }

    public DeleteRequest create(DeleteRequestDTO.CreatePayload payload) {
        User currentUser = this.userService.getCurrentUser();
        if (currentUser == null) return null;


        if (payload == null || payload.deviceId() == null || payload.deviceType() == null) {
            return null;
        }

        if (!this.deviceExists(payload.deviceType(), payload.deviceId())) {
            return null;
        }

        if (this.deleteRequestRepository.existsByDeviceTypeAndDeviceIdAndStatus(payload.deviceType(), payload.deviceId(), DeleteRequestStatus.PENDING)) {
            return null;
        }

        DeleteRequest request = new DeleteRequest(payload.deviceType(), payload.deviceId(), currentUser);
        return this.deleteRequestRepository.save(request);
    }

    public DeleteRequest review(Long requestID, DeleteRequestStatus targetStatus) {
        User admin = this.userService.getCurrentUser();
        if (admin == null) return null;

        DeleteRequest request = this.deleteRequestRepository.findById(requestID).orElse(null);
        if (request == null || request.getStatus() != DeleteRequestStatus.PENDING) {
            return null;
        }

        if (targetStatus == DeleteRequestStatus.APPROVED && !this.deleteDevice(request)) {
            return null;
        }

        request.setStatus(targetStatus);
        request.setReviewedAt(LocalDateTime.now());
        request.setReviewedBy(admin);

        return this.deleteRequestRepository.save(request);
    }

    private boolean deviceExists(DeleteRequestDeviceType deviceType, Long deviceId) {
        return switch (deviceType) {
            case SENSOR -> this.deviceService.findById(deviceId) != null;
            case ACTUATOR -> this.actuatorDeviceService.findById(deviceId) != null;
        };
    }

    private boolean deleteDevice(DeleteRequest request) {
        return switch (request.getDeviceType()) {
            case SENSOR -> this.deviceService.delete(request.getDeviceId());
            case ACTUATOR -> this.actuatorDeviceService.delete(request.getDeviceId());
        };
    }

}


package io.squid.cynapse.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.squid.cynapse.enums.DeleteRequestDeviceType;
import io.squid.cynapse.enums.DeleteRequestStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class DeleteRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeleteRequestDeviceType deviceType;

    @Column(nullable = false)
    private Long deviceId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeleteRequestStatus status;

    @Column(nullable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime reviewedAt;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "reviewed_by_id")
    private User reviewedBy;

    public DeleteRequest() {
        this.status = DeleteRequestStatus.PENDING;
        this.requestedAt = LocalDateTime.now();
    }

    public DeleteRequest(DeleteRequestDeviceType deviceType, Long deviceId, User requester) {
        this.deviceType = deviceType;
        this.deviceId = deviceId;
        this.requester = requester;
        this.status = DeleteRequestStatus.PENDING;
        this.requestedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DeleteRequestDeviceType getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(DeleteRequestDeviceType deviceType) {
        this.deviceType = deviceType;
    }

    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }

    public DeleteRequestStatus getStatus() {
        return status;
    }

    public void setStatus(DeleteRequestStatus status) {
        this.status = status;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public User getRequester() {
        return requester;
    }

    public void setRequester(User requester) {
        this.requester = requester;
    }

    public User getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(User reviewedBy) {
        this.reviewedBy = reviewedBy;
    }
}

package io.squid.cynapse.repositories;

import io.squid.cynapse.entities.DeleteRequest;
import io.squid.cynapse.enums.DeleteRequestDeviceType;
import io.squid.cynapse.enums.DeleteRequestStatus;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeleteRequestRepository extends CrudRepository<DeleteRequest, Long> {

    List<DeleteRequest> findAllByOrderByRequestedAtDesc();

    List<DeleteRequest> findByRequesterIdOrderByRequestedAtDesc(Long requesterId);

    List<DeleteRequest> findByStatusOrderByRequestedAtDesc(DeleteRequestStatus status);

    boolean existsByDeviceTypeAndDeviceIdAndStatus(DeleteRequestDeviceType deviceType, Long deviceId, DeleteRequestStatus status);

    long deleteByRequesterId(Long requesterId);

    @Modifying
    @Query("update DeleteRequest dr set dr.reviewedBy = null where dr.reviewedBy.id = :userId")
    int clearReviewedByForUser(@Param("userId") Long userId);
}


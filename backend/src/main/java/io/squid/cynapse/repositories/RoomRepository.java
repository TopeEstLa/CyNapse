package io.squid.cynapse.repositories;

import io.squid.cynapse.entities.Room;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends CrudRepository<Room, Long> {

    List<Room> findAll();

    Optional<Room> findByNameIgnoreCase(String name);
}


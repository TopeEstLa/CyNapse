package io.squid.cynapse.repositories;

import io.squid.cynapse.entities.UserValidationToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * @author TopeEstLa
 */
@Repository
public interface UserValidationTokenRepository extends CrudRepository<UserValidationToken, String> {
}

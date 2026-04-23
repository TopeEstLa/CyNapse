package io.squid.cynapse.repositories;

import io.squid.cynapse.entities.News;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsRepository extends CrudRepository<News, Long> {

    List<News> findAllByOrderByPublicationDateDescIdDesc();

    Optional<News> findBySlugIgnoreCase(String slug);

    boolean existsBySlugIgnoreCase(String slug);
}


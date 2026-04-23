package io.squid.cynapse.services;

import io.squid.cynapse.dto.NewsDTO;
import io.squid.cynapse.entities.News;
import io.squid.cynapse.repositories.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;

    public List<News> findAll() {
        return this.newsRepository.findAllByOrderByPublicationDateDescIdDesc();
    }

    public News findBySlug(String slug) {
        if (isBlank(slug)) {
            return null;
        }

        News news = this.newsRepository.findBySlugIgnoreCase(slug.trim()).orElse(null);
        if (news == null) {
            return null;
        }

        return news;
    }

    public News create(NewsDTO.NewsPayload payload) {
        if (!this.isValidPayloadForCreate(payload)) {
            return null;
        }

        String slug = payload.slug().trim();
        if (this.newsRepository.existsBySlugIgnoreCase(slug)) {
            return null;
        }

        News news = new News(
                slug,
                payload.title().trim(),
                payload.content(),
                payload.author().trim(),
                payload.publicationDate() == null ? LocalDateTime.now() : payload.publicationDate()
        );
        return this.newsRepository.save(news);
    }

    public News update(NewsDTO.NewsPayload payload) {
        if (payload == null || payload.id() == null || !this.isValidPayload(payload)) {
            return null;
        }

        News existingNews = this.newsRepository.findById(payload.id()).orElse(null);
        if (existingNews == null) {
            return null;
        }

        String slug = payload.slug().trim();
        News newsWithSameSlug = this.newsRepository.findBySlugIgnoreCase(slug).orElse(null);
        if (newsWithSameSlug != null && !newsWithSameSlug.getId().equals(existingNews.getId())) {
            return null;
        }

        existingNews.setSlug(slug);
        existingNews.setTitle(payload.title().trim());
        existingNews.setContent(payload.content());
        existingNews.setAuthor(payload.author().trim());
        existingNews.setPublicationDate(payload.publicationDate() == null ? existingNews.getPublicationDate() : payload.publicationDate());

        return this.newsRepository.save(existingNews);
    }

    public boolean delete(Long newsId) {
        if (newsId == null) {
            return false;
        }

        News existingNews = this.newsRepository.findById(newsId).orElse(null);
        if (existingNews == null) {
            return false;
        }

        this.newsRepository.delete(existingNews);
        return true;
    }

    private boolean isValidPayloadForCreate(NewsDTO.NewsPayload payload) {
        return payload != null && this.isValidPayload(payload);
    }

    private boolean isValidPayload(NewsDTO.NewsPayload payload) {
        return !isBlank(payload.slug())
                && !isBlank(payload.title())
                && !isBlank(payload.content())
                && !isBlank(payload.author());
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

}


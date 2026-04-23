package io.squid.cynapse.controllers.admin;

import io.squid.cynapse.dto.NewsDTO;
import io.squid.cynapse.entities.News;
import io.squid.cynapse.services.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/news")
@PreAuthorize("@authService.hasRequiredRole('ADMIN')")
public class AdminNewsController {

    @Autowired
    private NewsService newsService;

    @GetMapping("/list")
    public ResponseEntity<List<News>> listNews() {
        return ResponseEntity.ok(this.newsService.findAll());
    }

    @GetMapping("/get")
    public ResponseEntity<?> getNews(@RequestParam("slug") String slug) {
        News news = this.newsService.findBySlug(slug);
        if (news == null) {
            return ResponseEntity.badRequest().body("News not found");
        }

        return ResponseEntity.ok(news);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNews(@RequestBody NewsDTO.NewsPayload payload) {
        News createdNews = this.newsService.create(payload);
        if (createdNews == null) {
            return ResponseEntity.badRequest().body("Invalid payload or slug already exists");
        }

        return ResponseEntity.ok(createdNews);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateNews(@RequestBody NewsDTO.NewsPayload payload) {
        News updatedNews = this.newsService.update(payload);
        if (updatedNews == null) {
            return ResponseEntity.badRequest().body("Invalid payload, news not found or slug already exists");
        }

        return ResponseEntity.ok(updatedNews);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteNews(@RequestParam("id") Long newsId) {
        if (!this.newsService.delete(newsId)) {
            return ResponseEntity.badRequest().body("News not found");
        }

        return ResponseEntity.ok("News deleted");
    }
}


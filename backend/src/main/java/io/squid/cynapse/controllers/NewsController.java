package io.squid.cynapse.controllers;

import io.squid.cynapse.entities.News;
import io.squid.cynapse.services.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

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
}


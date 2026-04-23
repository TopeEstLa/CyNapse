package io.squid.cynapse.dto;

import java.time.LocalDateTime;

public class NewsDTO {

    public record NewsPayload(
            Long id,
            String slug,
            String title,
            String content,
            String author,
            LocalDateTime publicationDate
    ) {
    }

}


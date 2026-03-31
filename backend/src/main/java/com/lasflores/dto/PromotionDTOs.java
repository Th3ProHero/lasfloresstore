package com.lasflores.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

public class PromotionDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String title;
        private String description;
        private String imageUrl;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private Boolean isActive;
        private String externalLink;
        private Integer priority;
        private Long productId; // Opcional
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private String imageUrl;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private Boolean isActive;
        private String externalLink;
        private Integer priority;
        private Integer clickCount;
        
        // Datos del producto adjunto para evitar consultas en N+1
        private Long productId;
        private String productName;
        private String productCategory;
        private String productImageUrl;
    }
}

package com.lasflores.dto;

import lombok.Data;

public class LegalContentDTO {

    @Data
    public static class Request {
        private String content;
    }

    @Data
    public static class Response {
        private Long id;
        private String type;
        private String content;
        private Integer version;
        private String updatedAt;
    }
}

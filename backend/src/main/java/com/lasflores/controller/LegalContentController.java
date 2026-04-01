package com.lasflores.controller;

import com.lasflores.dto.LegalContentDTO;
import com.lasflores.service.LegalContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/legal")
@RequiredArgsConstructor
public class LegalContentController {

    private final LegalContentService service;

    // --- Público ---
    @GetMapping("/{type}")
    public LegalContentDTO.Response getLatestLegalContent(@PathVariable String type) {
        return service.getLatestByType(type);
    }

    // --- Admin ---
    @PostMapping("/{type}")
    public LegalContentDTO.Response updateLegalContent(@PathVariable String type, @RequestBody LegalContentDTO.Request req) {
        return service.saveContent(type, req);
    }
}

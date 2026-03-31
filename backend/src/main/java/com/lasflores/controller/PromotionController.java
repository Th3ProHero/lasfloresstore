package com.lasflores.controller;

import com.lasflores.dto.PromotionDTOs.*;
import com.lasflores.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    // --- Endpoints Públicos ---

    @GetMapping("/active")
    public List<Response> getActivePromotions() {
        return promotionService.getActivePromotions();
    }

    @PostMapping("/{id}/click")
    @ResponseStatus(HttpStatus.OK)
    public void registerClick(@PathVariable Long id) {
        promotionService.registerClick(id);
    }

    // --- Endpoints Administrador ---

    @GetMapping
    public List<Response> getAllPromotions() {
        return promotionService.getAllPromotions();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Response createPromotion(@RequestBody Request req) {
        return promotionService.createPromotion(req);
    }

    @PutMapping("/{id}")
    public Response updatePromotion(@PathVariable Long id, @RequestBody Request req) {
        return promotionService.updatePromotion(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
    }
}

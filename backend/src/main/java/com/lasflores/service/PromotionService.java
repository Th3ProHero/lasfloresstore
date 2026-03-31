package com.lasflores.service;

import com.lasflores.dto.PromotionDTOs.*;
import com.lasflores.entity.Product;
import com.lasflores.entity.Promotion;
import com.lasflores.repository.ProductRepository;
import com.lasflores.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<Response> getActivePromotions() {
        return promotionRepository.findActivePromotions(LocalDateTime.now())
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Response> getAllPromotions() {
        return promotionRepository.findAllPromotionsWithProduct()
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public Response createPromotion(Request req) {
        Promotion promo = new Promotion();
        updateEntityFromReq(promo, req);
        return mapToResponse(promotionRepository.save(promo));
    }

    @Transactional
    public Response updatePromotion(Long id, Request req) {
        Promotion promo = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        updateEntityFromReq(promo, req);
        return mapToResponse(promotionRepository.save(promo));
    }

    @Transactional
    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new RuntimeException("Promotion not found");
        }
        promotionRepository.deleteById(id);
    }

    @Transactional
    public void registerClick(Long id) {
        promotionRepository.incrementClickCount(id);
    }

    private void updateEntityFromReq(Promotion promo, Request req) {
        promo.setTitle(req.getTitle());
        promo.setDescription(req.getDescription());
        promo.setImageUrl(req.getImageUrl());
        promo.setStartDate(req.getStartDate());
        promo.setEndDate(req.getEndDate());
        promo.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);
        promo.setExternalLink(req.getExternalLink());
        promo.setPriority(req.getPriority() != null ? req.getPriority() : 1);

        if (req.getProductId() != null) {
            Product prod = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            promo.setProduct(prod);
        } else {
            promo.setProduct(null);
        }
    }

    private Response mapToResponse(Promotion p) {
        Response resp = new Response();
        resp.setId(p.getId());
        resp.setTitle(p.getTitle());
        resp.setDescription(p.getDescription());
        resp.setImageUrl(p.getImageUrl());
        resp.setStartDate(p.getStartDate());
        resp.setEndDate(p.getEndDate());
        resp.setIsActive(p.getIsActive());
        resp.setExternalLink(p.getExternalLink());
        resp.setPriority(p.getPriority());
        resp.setClickCount(p.getClickCount());

        if (p.getProduct() != null) {
            resp.setProductId(p.getProduct().getId());
            resp.setProductName(p.getProduct().getNombre());
            resp.setProductCategory(p.getProduct().getCategoria() != null ? p.getProduct().getCategoria().name() : null);
            resp.setProductImageUrl(p.getProduct().getImagenUrl());
        }
        return resp;
    }
}

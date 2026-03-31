package com.lasflores.controller;

import com.lasflores.dto.*;
import com.lasflores.entity.Categoria;
import com.lasflores.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(
            @RequestParam(required = false) Categoria categoria,
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        PageRequest pageable = PageRequest.of(page, size, sort);

        Page<ProductDTO> products;
        if (categoria != null || marca != null || search != null) {
            products = productService.getFilteredProducts(categoria, marca, search, pageable);
        } else {
            products = productService.getAllProducts(pageable);
        }

        return ResponseEntity.ok(products);
    }

    @GetMapping("/ofertas")
    public ResponseEntity<Page<ProductDTO>> getProductsOnSale(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(productService.getProductsOnSale(PageRequest.of(page, size)));
    }

    @GetMapping("/marcas")
    public ResponseEntity<List<String>> getAllMarcas() {
        return ResponseEntity.ok(productService.getAllMarcas());
    }

    @GetMapping("/categorias")
    public ResponseEntity<Categoria[]> getAllCategorias() {
        return ResponseEntity.ok(Categoria.values());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductCreateDTO dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // ─── Variants ─────────────────────────────────────────

    @GetMapping("/{id}/variants")
    public ResponseEntity<List<VariantDTO>> getVariants(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getVariants(id));
    }

    @PostMapping("/{id}/variants")
    public ResponseEntity<VariantDTO> addVariant(@PathVariable Long id, @Valid @RequestBody VariantCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.addVariant(id, dto));
    }

    @DeleteMapping("/variants/{variantId}")
    public ResponseEntity<Void> deleteVariant(@PathVariable Long variantId) {
        productService.deleteVariant(variantId);
        return ResponseEntity.noContent().build();
    }
}

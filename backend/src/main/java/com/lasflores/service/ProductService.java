package com.lasflores.service;

import com.lasflores.dto.*;
import com.lasflores.entity.*;
import com.lasflores.exception.ResourceNotFoundException;
import com.lasflores.repository.ProductRepository;
import com.lasflores.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    // ─── READ ─────────────────────────────────────────────

    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::toDTO);
    }

    public Page<ProductDTO> getFilteredProducts(Categoria categoria, String marca, String search, Pageable pageable) {
        String safeMarca = (marca == null) ? "" : marca;
        String safeSearch = (search == null) ? "" : search;
        
        if (categoria != null) {
            return productRepository.findByFiltersWithCategoria(categoria, safeMarca, safeSearch, pageable).map(this::toDTO);
        } else {
            return productRepository.findByFiltersAllCategorias(safeMarca, safeSearch, pageable).map(this::toDTO);
        }
    }

    public Page<ProductDTO> getProductsOnSale(Pageable pageable) {
        return productRepository.findByEnOfertaTrue(pageable).map(this::toDTO);
    }

    public ProductDTO getProductById(Long id) {
        Product product = findProductOrThrow(id);
        return toDTO(product);
    }

    public List<String> getAllMarcas() {
        return productRepository.findAllMarcas();
    }

    // ─── CREATE ───────────────────────────────────────────

    @Transactional
    public ProductDTO createProduct(ProductCreateDTO dto) {
        Product product = Product.builder()
                .nombre(dto.getNombre())
                .marca(dto.getMarca())
                .precio(dto.getPrecio())
                .categoria(dto.getCategoria())
                .enOferta(dto.getEnOferta() != null ? dto.getEnOferta() : false)
                .porcentajeDescuento(dto.getPorcentajeDescuento() != null ? dto.getPorcentajeDescuento() : 0)
                .descripcion(dto.getDescripcion())
                .numInventario(dto.getNumInventario())
                .imagenUrl(dto.getImagenUrl())
                .build();

        return toDTO(productRepository.save(product));
    }

    // ─── UPDATE ───────────────────────────────────────────

    @Transactional
    public ProductDTO updateProduct(Long id, ProductCreateDTO dto) {
        Product product = findProductOrThrow(id);

        product.setNombre(dto.getNombre());
        product.setMarca(dto.getMarca());
        product.setPrecio(dto.getPrecio());
        product.setCategoria(dto.getCategoria());
        product.setEnOferta(dto.getEnOferta());
        product.setPorcentajeDescuento(dto.getPorcentajeDescuento());
        product.setDescripcion(dto.getDescripcion());
        product.setNumInventario(dto.getNumInventario());
        product.setImagenUrl(dto.getImagenUrl());

        return toDTO(productRepository.save(product));
    }

    // ─── DELETE ───────────────────────────────────────────

    @Transactional
    public void deleteProduct(Long id) {
        Product product = findProductOrThrow(id);
        productRepository.delete(product);
    }

    // ─── VARIANTS ─────────────────────────────────────────

    public List<VariantDTO> getVariants(Long productId) {
        findProductOrThrow(productId);
        return variantRepository.findByProductId(productId)
                .stream().map(this::toVariantDTO).collect(Collectors.toList());
    }

    @Transactional
    public VariantDTO addVariant(Long productId, VariantCreateDTO dto) {
        Product product = findProductOrThrow(productId);

        ProductVariant variant = ProductVariant.builder()
                .sabor(dto.getSabor())
                .sku(dto.getSku())
                .precioExtra(dto.getPrecioExtra())
                .numInventario(dto.getNumInventario())
                .product(product)
                .build();

        return toVariantDTO(variantRepository.save(variant));
    }

    @Transactional
    public void deleteVariant(Long variantId) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Variante no encontrada con ID: " + variantId));
        variantRepository.delete(variant);
    }

    // ─── MAPPERS ──────────────────────────────────────────

    private ProductDTO toDTO(Product p) {
        return ProductDTO.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .marca(p.getMarca())
                .precio(p.getPrecio())
                .precioFinal(p.getPrecioFinal())
                .categoria(p.getCategoria())
                .enOferta(p.getEnOferta())
                .porcentajeDescuento(p.getPorcentajeDescuento())
                .descripcion(p.getDescripcion())
                .numInventario(p.getNumInventario())
                .imagenUrl(p.getImagenUrl())
                .variantes(p.getVariantes() != null
                        ? p.getVariantes().stream().map(this::toVariantDTO).collect(Collectors.toList())
                        : List.of())
                .build();
    }

    private VariantDTO toVariantDTO(ProductVariant v) {
        return VariantDTO.builder()
                .id(v.getId())
                .sabor(v.getSabor())
                .sku(v.getSku())
                .precioExtra(v.getPrecioExtra())
                .numInventario(v.getNumInventario())
                .build();
    }

    private Product findProductOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
    }
}

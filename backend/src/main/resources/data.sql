-- =============================================
-- Seed Data: Abarrotes Las Flores
-- =============================================

-- BEBIDAS
INSERT INTO products (nombre, marca, precio, categoria, en_oferta, porcentaje_descuento, descripcion, num_inventario, imagen_url, created_at, version) VALUES
('Boing Mango 500ml', 'Boing', 12.50, 'BEBIDAS', false, 0, 'Jugo de mango natural Boing, presentación de 500ml', 45, NULL, NOW(), 0),
('Coca-Cola 600ml', 'Coca-Cola', 18.00, 'BEBIDAS', true, 10, 'Refresco Coca-Cola original, presentación personal de 600ml', 120, NULL, NOW(), 0),
('Monster Energy 473ml', 'Monster', 35.00, 'BEBIDAS', false, 0, 'Bebida energética Monster Energy, presentación de 473ml', 30, NULL, NOW(), 0),
('Agua Ciel 1L', 'Ciel', 10.00, 'BEBIDAS', false, 0, 'Agua purificada Ciel, 1 litro', 200, NULL, NOW(), 0),
('Jumex Durazno 335ml', 'Jumex', 9.50, 'BEBIDAS', true, 15, 'Néctar de durazno Jumex, lata de 335ml', 80, NULL, NOW(), 0);

-- BOTANAS
INSERT INTO products (nombre, marca, precio, categoria, en_oferta, porcentaje_descuento, descripcion, num_inventario, imagen_url, created_at, version) VALUES
('Sabritas Original 45g', 'Sabritas', 18.50, 'BOTANAS', false, 0, 'Papas fritas Sabritas sabor original, bolsa de 45g', 65, NULL, NOW(), 0),
('Doritos Nacho 62g', 'Doritos', 20.00, 'BOTANAS', true, 20, 'Tortilla chips Doritos sabor nacho, bolsa de 62g', 55, NULL, NOW(), 0),
('Takis Fuego 56g', 'Barcel', 17.00, 'BOTANAS', false, 0, 'Botana enrollada Takis sabor Fuego, 56g', 70, NULL, NOW(), 0);

-- LACTEOS
INSERT INTO products (nombre, marca, precio, categoria, en_oferta, porcentaje_descuento, descripcion, num_inventario, imagen_url, created_at, version) VALUES
('Leche Lala Entera 1L', 'Lala', 28.00, 'LACTEOS', false, 0, 'Leche entera pasteurizada Lala, 1 litro', 40, NULL, NOW(), 0),
('Yoghurt Danone Natural 900g', 'Danone', 42.00, 'LACTEOS', true, 10, 'Yoghurt natural Danone, presentación familiar de 900g', 25, NULL, NOW(), 0);

-- LIMPIEZA
INSERT INTO products (nombre, marca, precio, categoria, en_oferta, porcentaje_descuento, descripcion, num_inventario, imagen_url, created_at, version) VALUES
('Fabuloso Lavanda 1L', 'Fabuloso', 32.00, 'LIMPIEZA', true, 25, 'Limpiador multiusos Fabuloso aroma lavanda, 1 litro', 35, NULL, NOW(), 0),
('Pinol Original 1L', 'Pinol', 29.00, 'LIMPIEZA', false, 0, 'Limpiador multiusos Pinol aroma pino, 1 litro', 28, NULL, NOW(), 0);

-- ENLATADOS
INSERT INTO products (nombre, marca, precio, categoria, en_oferta, porcentaje_descuento, descripcion, num_inventario, imagen_url, created_at, version) VALUES
('Atún Dolores en agua 140g', 'Dolores', 22.00, 'ENLATADOS', false, 0, 'Atún aleta amarilla en agua Dolores, lata de 140g', 50, NULL, NOW(), 0);

-- ABARROTES
INSERT INTO products (nombre, marca, precio, categoria, en_oferta, porcentaje_descuento, descripcion, num_inventario, imagen_url, created_at, version) VALUES
('Maruchan Res', 'Maruchan', 7.50, 'ABARROTES', false, 0, 'Sopa instantánea Maruchan sabor res', 150, NULL, NOW(), 0),
('Arroz SOS 900g', 'SOS', 25.00, 'ABARROTES', true, 15, 'Arroz grano largo SOS, bolsa de 900g', 40, NULL, NOW(), 0),
('Frijol La Sierra Refrito 580g', 'La Sierra', 28.50, 'ABARROTES', false, 0, 'Frijoles refritos La Sierra, lata de 580g', 35, NULL, NOW(), 0);

-- HIGIENE
INSERT INTO products (nombre, marca, precio, categoria, en_oferta, porcentaje_descuento, descripcion, num_inventario, imagen_url, created_at, version) VALUES
('Jabón Zote Rosa 400g', 'Zote', 18.00, 'HIGIENE', false, 0, 'Jabón de lavandería Zote rosa, barra de 400g', 60, NULL, NOW(), 0);

-- DULCES
INSERT INTO products (nombre, marca, precio, categoria, en_oferta, porcentaje_descuento, descripcion, num_inventario, imagen_url, created_at, version) VALUES
('Mazapán De La Rosa', 'De La Rosa', 5.00, 'DULCES', false, 0, 'Dulce tradicional de cacahuate De La Rosa', 200, NULL, NOW(), 0),
('Carlos V 18g', 'Nestlé', 12.00, 'DULCES', true, 10, 'Chocolate Carlos V, barra de 18g', 90, NULL, NOW(), 0);

-- =============================================
-- Variants (sabores)
-- =============================================

-- Boing variants (product_id = 1)
INSERT INTO product_variants (sabor, sku, precio_extra, num_inventario, product_id) VALUES
('Mango', 'BOING-MANGO-500', 0.00, 45, 1),
('Guayaba', 'BOING-GUAYABA-500', 0.00, 38, 1),
('Fresa', 'BOING-FRESA-500', 0.00, 30, 1),
('Durazno', 'BOING-DURAZNO-500', 0.00, 22, 1);

-- Monster Energy variants (product_id = 3)
INSERT INTO product_variants (sabor, sku, precio_extra, num_inventario, product_id) VALUES
('Original', 'MONSTER-OG-473', 0.00, 30, 3),
('Mango Loco', 'MONSTER-MANGO-473', 0.00, 25, 3),
('Ultra White', 'MONSTER-ULTRA-473', 2.00, 18, 3),
('Pipeline Punch', 'MONSTER-PUNCH-473', 0.00, 15, 3);

-- Maruchan variants (product_id = 15)
INSERT INTO product_variants (sabor, sku, precio_extra, num_inventario, product_id) VALUES
('Res', 'MARUCHAN-RES', 0.00, 80, 15),
('Pollo', 'MARUCHAN-POLLO', 0.00, 75, 15),
('Camarón', 'MARUCHAN-CAMARON', 0.50, 60, 15),
('Habanero', 'MARUCHAN-HAB', 0.50, 45, 15);

-- Fabuloso variants (product_id = 12)
INSERT INTO product_variants (sabor, sku, precio_extra, num_inventario, product_id) VALUES
('Lavanda', 'FAB-LAVANDA-1L', 0.00, 35, 12),
('Manzana Verde', 'FAB-MANZANA-1L', 0.00, 28, 12),
('Frescura Oceánica', 'FAB-OCEAN-1L', 0.00, 20, 12);

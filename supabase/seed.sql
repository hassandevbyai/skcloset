-- SKCLOSET - Seed Data
-- Run this AFTER the migration to populate sample products

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO public.categories (name, slug, description, display_order) VALUES
  ('Shirts & Tops', 'shirts', 'Premium shirts, t-shirts, polos, and tops', 1),
  ('Jackets & Outerwear', 'jackets', 'Coats, jackets, and outerwear for every season', 2),
  ('Bottoms', 'bottoms', 'Pants, jeans, shorts, and trousers', 3),
  ('Footwear', 'footwear', 'Sneakers, boots, loafers, and sandals', 4),
  ('Accessories', 'accessories', 'Hats, bags, belts, and more', 5),
  ('Knitwear & Sweaters', 'knitwear', 'Cashmere, wool, and cotton knits', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PRODUCTS
-- ============================================

-- 1. Polo Ralph Lauren - Classic Fit Mesh Polo
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, is_featured, tags)
VALUES (
  'a0000000-0001-4000-8000-000000000001',
  'Classic Fit Mesh Polo',
  'polo-ralph-lauren-classic-fit-mesh-polo',
  'The iconic mesh polo shirt crafted from breathable cotton. Features a two-button placket, ribbed collar, and the signature embroidered pony. A timeless wardrobe essential for smart casual dressing.',
  'Polo Ralph Lauren',
  'shirts',
  'polos',
  125.00,
  true,
  ARRAY['summer', 'smart-casual', 'iconic', 'preppy']
);

-- 2. The North Face - Nuptse 1996 Jacket
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, is_featured, tags)
VALUES (
  'a0000000-0002-4000-8000-000000000002',
  'Nuptse 1996 Retro Jacket',
  'north-face-nuptse-1996-retro-jacket',
  'The legendary Nuptse jacket returns with its iconic boxy silhouette and quilted design. Packed with 700-fill goose down for exceptional warmth. A streetwear icon reimagined.',
  'The North Face',
  'jackets',
  'puffer',
  330.00,
  true,
  ARRAY['winter', 'streetwear', 'iconic', 'warm']
);

-- 3. Nike - Air Jordan 4 Retro
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, is_featured, tags)
VALUES (
  'a0000000-0003-4000-8000-000000000003',
  'Air Jordan 4 Retro ''Bred''',
  'nike-air-jordan-4-retro-bred',
  'The Air Jordan 4 Retro in the iconic ''Bred'' colorway. Features a black nubuck upper with Fire Red and Cement Grey accents. Visible Air-Sole unit and classic netting details.',
  'Nike',
  'footwear',
  'sneakers',
  215.00,
  true,
  ARRAY['sneakers', 'iconic', 'jordan', 'limited']
);

-- 4. Birkenstock - Arizona Sandals
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, is_featured, tags)
VALUES (
  'a0000000-0004-4000-8000-000000000004',
  'Arizona Big Buckle Sandals',
  'birkenstock-arizona-big-buckle-sandals',
  'The iconic Arizona sandal elevated with oversized buckles. Features a contoured cork-latex footbed that molds to your feet for custom comfort. Oiled leather upper for durability.',
  'Birkenstock',
  'footwear',
  'sandals',
  165.00,
  true,
  ARRAY['summer', 'comfort', 'iconic', 'everyday']
);

-- 5. Ralph Lauren - Oxford Button-Down
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, sale_price, is_featured, tags)
VALUES (
  'a0000000-0005-4000-8000-000000000005',
  'Custom Fit Oxford Button-Down Shirt',
  'polo-ralph-lauren-oxford-button-down',
  'A cornerstone of American style. Crafted from heavyweight cotton oxford cloth with a button-down collar and box-pleated back for ease of movement. The ultimate wardrobe staple.',
  'Polo Ralph Lauren',
  'shirts',
  'button-downs',
  148.50,
  118.80,
  true,
  ARRAY['classic', 'preppy', 'essential', 'work']
);

-- 6. Adidas - Samba OG
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, tags)
VALUES (
  'a0000000-0006-4000-8000-000000000006',
  'Samba OG Core Black',
  'adidas-samba-og-core-black',
  'The iconic Samba silhouette returns in its original form. Full-grain leather upper with suede overlays, gum rubber outsole, and the signature 3-Stripe design. A street-level legend.',
  'Adidas',
  'footwear',
  'sneakers',
  100.00,
  ARRAY['sneakers', 'iconic', 'retro', 'everyday']
);

-- 7. Supreme - Box Logo Hoodie
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, tags)
VALUES (
  'a0000000-0007-4000-8000-000000000007',
  'Box Logo Heavyweight Hoodie',
  'supreme-box-logo-heavyweight-hoodie',
  'The most iconic hoodie in streetwear. Cut from heavyweight 12 oz cross-grain French terry cotton. Features the signature Box Logo embroidered at the chest. Made in the USA.',
  'Supreme',
  'knitwear',
  'hoodies',
  168.00,
  ARRAY['streetwear', 'iconic', 'limited', 'drop']
);

-- 8. The North Face - Denali Jacket
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, tags)
VALUES (
  'a0000000-0008-4000-8000-000000000008',
  'Denali 2 Jacket',
  'north-face-denali-2-jacket',
  'A modern update to the classic Denali fleece jacket. Made with recycled Polartec® fleece and featuring zip-in compatibility with TNF outer shells. Versatile mid-layer for any adventure.',
  'The North Face',
  'jackets',
  'fleece',
  200.00,
  ARRAY['outdoor', 'classic', 'versatile', 'sustainable']
);

-- 9. Polo Ralph Lauren - Carpenter Jeans
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, tags)
VALUES (
  'a0000000-0009-4000-8000-000000000009',
  'Classic Carpenter Jeans',
  'polo-ralph-lauren-carpenter-jeans',
  'Relaxed-fit carpenter jeans crafted from rugged cotton denim. Features a mid-rise waist, straight leg, and authentic carpenter details including hammer loop and tool pockets.',
  'Polo Ralph Lauren',
  'bottoms',
  'jeans',
  98.00,
  ARRAY['denim', 'workwear', 'relaxed', 'casual']
);

-- 10. Timberland - 6-Inch Premium Boot
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, is_featured, tags)
VALUES (
  'a0000000-0010-4000-8000-000000000010',
  '6-Inch Premium Waterproof Boot',
  'timberland-6-inch-premium-waterproof-boot',
  'The world-famous Timberland boot. Premium nubuck leather upper with waterproof construction, seam-sealed waterproof protection, and a padded collar for comfort. The definitive workwear icon.',
  'Timberland',
  'footwear',
  'boots',
  198.00,
  true,
  ARRAY['boots', 'iconic', 'workwear', 'winter']
);

-- 11. Nike - Club Cargo Pant
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, tags)
VALUES (
  'a0000000-0011-4000-8000-000000000011',
  'Nike Club Cargo Pant',
  'nike-club-cargo-pant',
  'Relaxed cargo pants crafted from heavyweight cotton twill. Features an elastic waistband with drawcord, multiple cargo pockets, and a tapered leg. The perfect blend of comfort and utility.',
  'Nike',
  'bottoms',
  'cargo',
  85.00,
  ARRAY['cargo', 'streetwear', 'comfort', 'casual']
);

-- 12. Adidas - Originals Trefoil Tee
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, tags)
VALUES (
  'a0000000-0012-4000-8000-000000000012',
  'Originals Trefoil Logo Tee',
  'adidas-originals-trefoil-logo-tee',
  'A classic t-shirt featuring the iconic Trefoil logo. Cut from soft cotton jersey with a regular fit and ribbed crewneck collar. Timeless simplicity from the Three Stripes.',
  'Adidas',
  'shirts',
  't-shirts',
  40.00,
  ARRAY['t-shirt', 'basics', 'logo', 'everyday']
);

-- 13. Polo Ralph Lauren - Cashmere Beanie
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, tags)
VALUES (
  'a0000000-0013-4000-8000-000000000013',
  'Cashmere Pony Beanie',
  'polo-ralph-lauren-cashmere-pony-beanie',
  'Luxuriously soft beanie knitted from pure cashmere. Features a ribbed knit construction and embroidered Pony at the cuff. The perfect finishing touch for cold-weather looks.',
  'Polo Ralph Lauren',
  'accessories',
  'hats',
  75.00,
  ARRAY['beanie', 'cashmere', 'winter', 'luxury']
);

-- 14. Travis Scott x Air Jordan 1 Low - OG
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, tags)
VALUES (
  'a0000000-0014-4000-8000-000000000014',
  'Air Jordan 1 Low x Travis Scott',
  'nike-air-jordan-1-low-travis-scott',
  'The highly coveted Travis Scott collaboration. Features a brown suede upper with the signature reverse Swoosh, Cactus Jack branding, and sail midsole. A grail for collectors.',
  'Nike',
  'footwear',
  'sneakers',
  450.00,
  ARRAY['sneakers', 'collaboration', 'limited', 'grail']
);

-- 15. Supreme - Motion Logo Tee
INSERT INTO public.products (id, name, slug, description, brand, category, subcategory, base_price, tags)
VALUES (
  'a0000000-0015-4000-8000-000000000015',
  'Motion Logo T-Shirt',
  'supreme-motion-logo-tee',
  'Bold graphic t-shirt featuring the dynamic Motion Logo print. Cut from heavyweight cotton jersey with a relaxed fit. A statement piece from the latest collection.',
  'Supreme',
  'shirts',
  't-shirts',
  68.00,
  ARRAY['streetwear', 'graphic', 'logo', 'bold']
);

-- ============================================
-- PRODUCT VARIANTS
-- ============================================

-- Polo Classic Fit Mesh Polo (XS-XXL, 4 colors)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0001-4000-8000-000000000001', 'POLO-MESH-WHT-M', 'M', 'White', '#FFFFFF', NULL, 25, true),
  ('a0000000-0001-4000-8000-000000000001', 'POLO-MESH-WHT-L', 'L', 'White', '#FFFFFF', NULL, 30, false),
  ('a0000000-0001-4000-8000-000000000001', 'POLO-MESH-WHT-XL', 'XL', 'White', '#FFFFFF', NULL, 20, false),
  ('a0000000-0001-4000-8000-000000000001', 'POLO-MESH-NVY-M', 'M', 'Navy', '#1B2A4A', NULL, 15, false),
  ('a0000000-0001-4000-8000-000000000001', 'POLO-MESH-NVY-L', 'L', 'Navy', '#1B2A4A', NULL, 20, false),
  ('a0000000-0001-4000-8000-000000000001', 'POLO-MESH-NVY-XL', 'XL', 'Navy', '#1B2A4A', NULL, 10, false),
  ('a0000000-0001-4000-8000-000000000001', 'POLO-MESH-BLK-M', 'M', 'Black', '#0A0A0A', NULL, 20, false),
  ('a0000000-0001-4000-8000-000000000001', 'POLO-MESH-BLK-L', 'L', 'Black', '#0A0A0A', NULL, 25, false),
  ('a0000000-0001-4000-8000-000000000001', 'POLO-MESH-BLK-XL', 'XL', 'Black', '#0A0A0A', NULL, 15, false),
  ('a0000000-0001-4000-8000-000000000001', 'POLO-MESH-BRG-M', 'M', 'Burgundy', '#800020', NULL, 12, false),
  ('a0000000-0001-4000-8000-000000000001', 'POLO-MESH-BRG-L', 'L', 'Burgundy', '#800020', NULL, 18, false);

-- Nuptse 1996 Retro Jacket (S-XL, 3 colors)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0002-4000-8000-000000000002', 'NUPTSE-BLK-M', 'M', 'Black', '#0A0A0A', NULL, 12, true),
  ('a0000000-0002-4000-8000-000000000002', 'NUPTSE-BLK-L', 'L', 'Black', '#0A0A0A', NULL, 15, false),
  ('a0000000-0002-4000-8000-000000000002', 'NUPTSE-BLK-XL', 'XL', 'Black', '#0A0A0A', NULL, 8, false),
  ('a0000000-0002-4000-8000-000000000002', 'NUPTSE-NAV-M', 'M', 'Navy', '#1B2A4A', NULL, 10, false),
  ('a0000000-0002-4000-8000-000000000002', 'NUPTSE-NAV-L', 'L', 'Navy', '#1B2A4A', NULL, 14, false),
  ('a0000000-0002-4000-8000-000000000002', 'NUPTSE-NAV-XL', 'XL', 'Navy', '#1B2A4A', NULL, 6, false),
  ('a0000000-0002-4000-8000-000000000002', 'NUPTSE-GRN-M', 'M', 'Green', '#2E4A27', NULL, 8, false),
  ('a0000000-0002-4000-8000-000000000002', 'NUPTSE-GRN-L', 'L', 'Green', '#2E4A27', NULL, 10, false);

-- Air Jordan 4 Retro (US 7-13)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0003-4000-8000-000000000003', 'J4-BRED-9', 'US 9', 'Black/Red', '#0A0A0A', NULL, 5, true),
  ('a0000000-0003-4000-8000-000000000003', 'J4-BRED-10', 'US 10', 'Black/Red', '#0A0A0A', NULL, 8, false),
  ('a0000000-0003-4000-8000-000000000003', 'J4-BRED-11', 'US 11', 'Black/Red', '#0A0A0A', NULL, 6, false),
  ('a0000000-0003-4000-8000-000000000003', 'J4-BRED-12', 'US 12', 'Black/Red', '#0A0A0A', NULL, 3, false);

-- Birkenstock Arizona (EU 39-44, 2 colors)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0004-4000-8000-000000000004', 'ARIZ-BLK-42', 'EU 42', 'Black', '#0A0A0A', NULL, 20, true),
  ('a0000000-0004-4000-8000-000000000004', 'ARIZ-BLK-43', 'EU 43', 'Black', '#0A0A0A', NULL, 18, false),
  ('a0000000-0004-4000-8000-000000000004', 'ARIZ-BLK-44', 'EU 44', 'Black', '#0A0A0A', NULL, 15, false),
  ('a0000000-0004-4000-8000-000000000004', 'ARIZ-TAB-42', 'EU 42', 'Tobacco', '#8B6914', NULL, 12, false),
  ('a0000000-0004-4000-8000-000000000004', 'ARIZ-TAB-43', 'EU 43', 'Tobacco', '#8B6914', NULL, 14, false);

-- Oxford Button-Down (XS-XXL, 2 colors)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0005-4000-8000-000000000005', 'OXF-WHT-M', 'M', 'White', '#FFFFFF', 148.50, 30, true),
  ('a0000000-0005-4000-8000-000000000005', 'OXF-WHT-L', 'L', 'White', '#FFFFFF', 148.50, 35, false),
  ('a0000000-0005-4000-8000-000000000005', 'OXF-WHT-XL', 'XL', 'White', '#FFFFFF', 148.50, 25, false),
  ('a0000000-0005-4000-8000-000000000005', 'OXF-BLU-M', 'M', 'Blue', '#4A7DB4', 148.50, 20, false),
  ('a0000000-0005-4000-8000-000000000005', 'OXF-BLU-L', 'L', 'Blue', '#4A7DB4', 148.50, 28, false),
  ('a0000000-0005-4000-8000-000000000005', 'OXF-BLU-XL', 'XL', 'Blue', '#4A7DB4', 148.50, 18, false);

-- Samba OG Core Black (US 7-13)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0006-4000-8000-000000000006', 'SAMBA-BLK-9', 'US 9', 'Core Black', '#0A0A0A', NULL, 22, true),
  ('a0000000-0006-4000-8000-000000000006', 'SAMBA-BLK-10', 'US 10', 'Core Black', '#0A0A0A', NULL, 25, false),
  ('a0000000-0006-4000-8000-000000000006', 'SAMBA-BLK-11', 'US 11', 'Core Black', '#0A0A0A', NULL, 20, false),
  ('a0000000-0006-4000-8000-000000000006', 'SAMBA-BLK-12', 'US 12', 'Core Black', '#0A0A0A', NULL, 12, false);

-- Supreme Box Logo Hoodie (M-XL)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0007-4000-8000-000000000007', 'SUP-BOGO-NVY-M', 'M', 'Navy', '#1B2A4A', NULL, 4, true),
  ('a0000000-0007-4000-8000-000000000007', 'SUP-BOGO-NVY-L', 'L', 'Navy', '#1B2A4A', NULL, 6, false),
  ('a0000000-0007-4000-8000-000000000007', 'SUP-BOGO-NVY-XL', 'XL', 'Navy', '#1B2A4A', NULL, 3, false);

-- Denali 2 Jacket (S-XL)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0008-4000-8000-000000000008', 'DENALI-BLK-M', 'M', 'Black', '#0A0A0A', NULL, 15, true),
  ('a0000000-0008-4000-8000-000000000008', 'DENALI-BLK-L', 'L', 'Black', '#0A0A0A', NULL, 20, false),
  ('a0000000-0008-4000-8000-000000000008', 'DENALI-BLK-XL', 'XL', 'Black', '#0A0A0A', NULL, 12, false);

-- Carpenter Jeans (30-36)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0009-4000-8000-000000000009', 'CARP-BLK-32', '32', 'Black', '#0A0A0A', NULL, 20, true),
  ('a0000000-0009-4000-8000-000000000009', 'CARP-BLK-34', '34', 'Black', '#0A0A0A', NULL, 25, false),
  ('a0000000-0009-4000-8000-000000000009', 'CARP-BLK-36', '36', 'Black', '#0A0A0A', NULL, 15, false),
  ('a0000000-0009-4000-8000-000000000009', 'CARP-DEN-32', '32', 'Denim Blue', '#4A6E8A', NULL, 18, false),
  ('a0000000-0009-4000-8000-000000000009', 'CARP-DEN-34', '34', 'Denim Blue', '#4A6E8A', NULL, 22, false);

-- Timberland 6-Inch Boot (US 8-12)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0010-4000-8000-000000000010', 'TIMB-WHT-9', 'US 9', 'Wheat', '#D4A854', NULL, 16, true),
  ('a0000000-0010-4000-8000-000000000010', 'TIMB-WHT-10', 'US 10', 'Wheat', '#D4A854', NULL, 20, false),
  ('a0000000-0010-4000-8000-000000000010', 'TIMB-WHT-11', 'US 11', 'Wheat', '#D4A854', NULL, 18, false),
  ('a0000000-0010-4000-8000-000000000010', 'TIMB-WHT-12', 'US 12', 'Wheat', '#D4A854', NULL, 10, false);

-- Nike Club Cargo (S-XL)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0011-4000-8000-000000000011', 'CARGO-BLK-M', 'M', 'Black', '#0A0A0A', NULL, 25, true),
  ('a0000000-0011-4000-8000-000000000011', 'CARGO-BLK-L', 'L', 'Black', '#0A0A0A', NULL, 30, false),
  ('a0000000-0011-4000-8000-000000000011', 'CARGO-BLK-XL', 'XL', 'Black', '#0A0A0A', NULL, 20, false);

-- Trefoil Logo Tee (S-XL)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0012-4000-8000-000000000012', 'TREFOIL-WHT-M', 'M', 'White', '#FFFFFF', NULL, 40, true),
  ('a0000000-0012-4000-8000-000000000012', 'TREFOIL-WHT-L', 'L', 'White', '#FFFFFF', NULL, 45, false),
  ('a0000000-0012-4000-8000-000000000012', 'TREFOIL-WHT-XL', 'XL', 'White', '#FFFFFF', NULL, 35, false),
  ('a0000000-0012-4000-8000-000000000012', 'TREFOIL-BLK-M', 'M', 'Black', '#0A0A0A', NULL, 38, false),
  ('a0000000-0012-4000-8000-000000000012', 'TREFOIL-BLK-L', 'L', 'Black', '#0A0A0A', NULL, 42, false);

-- Cashmere Pony Beanie (One Size, 2 colors)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0013-4000-8000-000000000013', 'BEANIE-BLK-OS', 'One Size', 'Black', '#0A0A0A', NULL, 30, true),
  ('a0000000-0013-4000-8000-000000000013', 'BEANIE-NVY-OS', 'One Size', 'Navy', '#1B2A4A', NULL, 25, false);

-- Travis Scott AJ1 Low (US 8-12)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0014-4000-8000-000000000014', 'TSAJ1-BRN-9', 'US 9', 'Brown', '#6B4226', NULL, 2, true),
  ('a0000000-0014-4000-8000-000000000014', 'TSAJ1-BRN-10', 'US 10', 'Brown', '#6B4226', NULL, 3, false),
  ('a0000000-0014-4000-8000-000000000014', 'TSAJ1-BRN-11', 'US 11', 'Brown', '#6B4226', NULL, 1, false);

-- Supreme Motion Tee (M-XL)
INSERT INTO public.product_variants (product_id, sku, size, color, color_hex, price, stock_quantity, is_default) VALUES
  ('a0000000-0015-4000-8000-000000000015', 'MOTION-WHT-M', 'M', 'White', '#FFFFFF', NULL, 10, true),
  ('a0000000-0015-4000-8000-000000000015', 'MOTION-WHT-L', 'L', 'White', '#FFFFFF', NULL, 12, false),
  ('a0000000-0015-4000-8000-000000000015', 'MOTION-WHT-XL', 'XL', 'White', '#FFFFFF', NULL, 8, false),
  ('a0000000-0015-4000-8000-000000000015', 'MOTION-BLK-M', 'M', 'Black', '#0A0A0A', NULL, 8, false),
  ('a0000000-0015-4000-8000-000000000015', 'MOTION-BLK-L', 'L', 'Black', '#0A0A0A', NULL, 10, false);

-- ============================================
-- PRODUCT IMAGES
-- ============================================
-- Note: Replace placeholder URLs with actual product images
INSERT INTO public.product_images (product_id, url, alt_text, display_order, is_primary) VALUES
  ('a0000000-0001-4000-8000-000000000001', 'https://placehold.co/600x800/f5f3ef/0a0a0a?text=Polo+Mesh+Polo', 'Polo Ralph Lauren Classic Fit Mesh Polo', 0, true),
  ('a0000000-0002-4000-8000-000000000002', 'https://placehold.co/600x800/0a0a0a/f5f3ef?text=Nuptse+Jacket', 'The North Face Nuptse 1996 Retro Jacket', 0, true),
  ('a0000000-0003-4000-8000-000000000003', 'https://placehold.co/600x800/0a0a0a/ce1111?text=AJ4+Bred', 'Air Jordan 4 Retro Bred', 0, true),
  ('a0000000-0004-4000-8000-000000000004', 'https://placehold.co/600x800/0a0a0a/f5f3ef?text=Arizona', 'Birkenstock Arizona Big Buckle Sandals', 0, true),
  ('a0000000-0005-4000-8000-000000000005', 'https://placehold.co/600x800/ffffff/0a0a0a?text=Oxford+Shirt', 'Polo Ralph Lauren Oxford Button-Down Shirt', 0, true),
  ('a0000000-0006-4000-8000-000000000006', 'https://placehold.co/600x800/1a1a1a/f5f3ef?text=Samba+OG', 'Adidas Samba OG Core Black', 0, true),
  ('a0000000-0007-4000-8000-000000000007', 'https://placehold.co/600x800/ce1111/ffffff?text=Supreme+Bogo', 'Supreme Box Logo Heavyweight Hoodie', 0, true),
  ('a0000000-0008-4000-8000-000000000008', 'https://placehold.co/600x800/2a4a6b/f5f3ef?text=Denali', 'The North Face Denali 2 Jacket', 0, true),
  ('a0000000-0009-4000-8000-000000000009', 'https://placehold.co/600x800/4a6e8a/f5f3ef?text=Carpenter+Jeans', 'Polo Ralph Lauren Classic Carpenter Jeans', 0, true),
  ('a0000000-0010-4000-8000-000000000010', 'https://placehold.co/600x800/d4a854/0a0a0a?text=Timberland+6in', 'Timberland 6-Inch Premium Waterproof Boot', 0, true),
  ('a0000000-0011-4000-8000-000000000011', 'https://placehold.co/600x800/0a0a0a/f5f3ef?text=Cargo+Pant', 'Nike Club Cargo Pant', 0, true),
  ('a0000000-0012-4000-8000-000000000012', 'https://placehold.co/600x800/ffffff/0a0a0a?text=Trefoil+Tee', 'Adidas Originals Trefoil Logo Tee', 0, true),
  ('a0000000-0013-4000-8000-000000000013', 'https://placehold.co/600x800/0a0a0a/f5f3ef?text=Beanie', 'Polo Ralph Lauren Cashmere Pony Beanie', 0, true),
  ('a0000000-0014-4000-8000-000000000014', 'https://placehold.co/600x800/6b4226/f5f3ef?text=Travis+Scott+AJ1', 'Air Jordan 1 Low x Travis Scott', 0, true),
  ('a0000000-0015-4000-8000-000000000015', 'https://placehold.co/600x800/ffffff/ce1111?text=Motion+Logo', 'Supreme Motion Logo T-Shirt', 0, true);

-- ============================================
-- ADMIN USER (run this separately via Supabase dashboard after creating the user)
-- ============================================
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'admin@skcloset.com';

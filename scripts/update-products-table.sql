-- Add a column to store uploaded image data (base64 or blob)
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_data TEXT;

-- Update the existing products table structure
COMMENT ON COLUMN products.image IS 'Image URL (for external images)';
COMMENT ON COLUMN products.image_data IS 'Base64 encoded image data (for uploaded images)';

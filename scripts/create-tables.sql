-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL
);

-- Insert sample products
INSERT INTO products (name, price, image, category) VALUES
('Cheeseburger', 8.99, '/classic-beef-burger.png', 'food'),
('Pepperoni Pizza', 12.99, '/delicious-pizza.png', 'food'),
('Caesar Salad', 7.99, '/vibrant-mixed-salad.png', 'food'),
('Chicken Wings', 9.99, '/crispy-chicken-wings.png', 'food'),
('French Fries', 3.99, '/crispy-french-fries.png', 'food'),
('Coca Cola', 2.49, '/refreshing-cola.png', 'drinks'),
('Iced Tea', 2.99, '/iced-tea.png', 'drinks'),
('Orange Juice', 3.49, '/glass-of-orange-juice.png', 'drinks'),
('Latte', 4.49, '/latte-coffee.png', 'drinks'),
('Bottled Water', 1.99, '/bottled-water.png', 'drinks'),
('Chocolate Cake', 5.99, '/chocolate-cake-slice.png', 'desserts'),
('Cheesecake', 6.49, '/cheesecake-slice.png', 'desserts'),
('Ice Cream', 4.99, '/ice-cream-sundae.png', 'desserts'),
('Apple Pie', 5.49, '/apple-pie-slice.png', 'desserts'),
('Brownie', 3.99, '/chocolate-brownie.png', 'desserts')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Products are viewable by authenticated users" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Products are insertable by authenticated users" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products are updatable by authenticated users" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Products are deletable by authenticated users" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Invoices are viewable by owner" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Invoices are insertable by authenticated users" ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Invoice items are viewable by invoice owner" ON invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Invoice items are insertable by authenticated users" ON invoice_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

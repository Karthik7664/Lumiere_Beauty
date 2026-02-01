export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  detailed_description: string | null;
  price: number;
  original_price: number | null;
  image_url: string;
  images: string[];
  category_id: string | null;
  rating: number;
  reviews_count: number;
  badge: string | null;
  badge_variant: string;
  in_stock: boolean;
  stock_quantity: number;
  ingredients: string[] | null;
  how_to_use: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress | null;
  payment_method: string;
  payment_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  created_at: string;
}

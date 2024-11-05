import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

// Sample product data
export const products = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    description: "Advanced smartwatch with health tracking features",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    category: "Electronics",
  },
  {
    id: "3",
    name: "Leather Laptop Bag",
    description: "Stylish and durable leather laptop bag",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    category: "Accessories",
  },
  {
    id: "4",
    name: "Minimalist Desk Lamp",
    description: "Modern LED desk lamp with adjustable brightness",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    category: "Home",
  },
  {
    id: "5",
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad for smartphones",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&q=80",
    category: "Electronics",
  },
  {
    id: "6",
    name: "Premium Coffee Maker",
    description: "Professional-grade coffee maker for perfect brews",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
    category: "Home",
  },
];

export const categories = [
  "All",
  "Electronics",
  "Accessories",
  "Home",
];
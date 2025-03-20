export type ProductsState = {
  products: Product[];
  filteredProducts: Product[];
  currentPage: number;
  productsPerPage: number;
};

export interface CartState {
  products: Product[];
  totalPrice: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: Category;
  subcategory: Category;
  price: number;
  images: string[];
  variants: Variant[];
  ratings: number;
  createdAt: string;
  updatedAt: string;
}
export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
}

export interface Variant {
  _id: string;
  size: string;
  color: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: {
    product: Product;
    variantId: string;
    quantity: number;
    _id: string;
  }[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

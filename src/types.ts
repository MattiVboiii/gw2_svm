export type ProductsState = {
  products: Product[];
  filteredProducts: Product[];
  currentPage: number;
  productsPerPage: number;
};

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

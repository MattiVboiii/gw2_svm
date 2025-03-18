export type ProductsState = {
  products: Product[];
  filteredProducts: Product[];
  currentPage: number;
};

export interface Product {
  _id:         string;
  name:        string;
  description: string;
  category:    Category;
  subcategory: Category;
  price:       number;
  images:      string[];
  variants:    Variant[];
  ratings:     number;
  createdAt:   Date;
  updatedAt:   Date;
}
export interface Category {
  _id:         string;
  name:        string;
  description: string;
  createdAt:   Date;
  updatedAt:   Date;
  category?:   string;
}

export interface Variant {
  _id:   string;
  size:  string;
  color: string;
}
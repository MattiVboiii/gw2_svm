export type ProductsState = {
  products: Product[];
  filteredProducts: Product[];
  currentPage: number;
};

export type Product = {
  name: string;
  description: string;
  category: {
    name: string;
    description: string;
  };
  subcategory: {
    name: string;
    description: string;
    category: string;
  };
  price: number;
  images: string[];
  variants: {
    size: string;
    color: string;
  }[];
  ratings: number;
};

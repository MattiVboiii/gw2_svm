export type ProductCardProps = Pick<
  Product,
  "_id" | "slug" | "name" | "images" | "price" | "ratings"
> & {
  discountPercentage?: number;          // Optional discount %
  onAddToCart?: () => void;            // Handler for Add to Cart
  wishlistButton?: React.ReactNode;    // Optional custom heart icon
  showAddToCart?: boolean;             // Show/hide cart button
  showRating?: boolean;                // Show/hide stars
  showDiscount?: boolean;              // Show/hide discount badge
  customLink?: string;                 // Override link path
  className?: string;                  // Custom class for wrapper
  customImageStyle?: React.CSSProperties; // Custom style for image
};


export type ProductsState = {
  products: Product[];
  filteredProducts: Product[];
  flashSales: Product[];
  bestSelling: Product[];
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
  slug: string;
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

export interface CartItem {
  product: Product;
  variantId: string;
  quantity: number;
  _id: string;
}

export interface WishlistItem {
  _id: string;
  name: string;
  images: string[];
  price: number;
}

// Props to receive the target date for countdown
export type CountdownProps = {
  date: string;
};

// Structure of the remaining time
export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

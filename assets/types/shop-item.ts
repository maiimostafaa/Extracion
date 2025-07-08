type FilterOptions = "featured" | "beans" | "tools" | "gift cards";
export interface ShopItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: FilterOptions;
  description: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  brand?: string;
  features?: string[];
  specifications?: { [key: string]: string };
}

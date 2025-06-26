export type shopItem =
  | BeansItem
  | ToolsItem
  | CouponsItem
  | MerchItem;

interface BaseShopItem {
  id: number; // Unique identifier for the shop item
  name: string; // Name of the shop item
  description: string; // Description of the shop item
  price: number; // Price of the shop item
  image: string; // URL or local path to the item's image
  reviewsCount: number; // Number of reviews for the shop item
  isFavorite?: boolean; // Optional field to indicate if the item is marked as favorite by the user
  inStock: boolean; // Indicates if the item is currently in stock
}

interface BeansItem extends BaseShopItem {
  category: "beans";
  taste: string; // Taste profile of the beans (e.g., "Fruity", "Nutty")
  sweetness: string; // Sweetness level of the beans (e.g., "Low", "Medium", "High")
  roasterLevel: string; // Roasting level of the beans (e.g., "Light", "Medium", "Dark")
  sizes: string[]; // Available sizes for the beans (e.g., ["250g", "500g", "1kg"])
  origin: string; // Country or region of origin
}

interface ToolsItem extends BaseShopItem {
  category: "tools";
  material: string[]; // Material of the tool (e.g., stainless steel, plastic)
  color: string[]; // Color of the tool
  capacity? : string; // Optional capacity for tools (e.g., "1L", "500ml")
  pieces?: number; // Optional number of pieces in a set (e.g., 1, 2, 4)
}

interface CouponsItem extends BaseShopItem {
  category: "coupons";
  company: string; // Company or brand offering the coupon (e.g., "Coffee Co.")
  discountPercentage: number; // Discount percentage for the coupon
  appliesTo: string[]; // List of items or categories the coupon applies to (e.g., ["beans", "tools"])
  expirationDate: string; // Expiration date for the coupon
  qrCode: string; // QR code for the coupon, can be a URL or base64 encoded image
}

interface MerchItem extends BaseShopItem {
  category: "merch";
  description: string; // Description of the merchandise (e.g., "Stylish coffee mug")
  sizes?: string[]; // Available sizes for merchandise (e.g., ["S", "M", "L"])
  colorOptions?: string[]; // Available color options for merchandise
  material?: string; // Material of the merchandise (e.g., cotton, polyester)
  limitedEdition?: boolean; // Optional field to indicate if the merchandise is a limited edition item
}
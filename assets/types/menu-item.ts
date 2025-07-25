export interface menuItem {
  id: string; // Unique identifier for the menu item
  name: string; // Name of the menu item
  description?: string; // Optional description of the menu item
  price: number; // Price of the menu item
  image?: string; // URL or local path to the image of the menu item
  isAvailable: boolean; // Availability status of the menu item
  ingredients?: string[]; // Optional list of ingredients in the menu item
}

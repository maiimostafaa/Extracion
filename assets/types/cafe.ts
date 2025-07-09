import { menuItem } from "./menu-item";

export interface Cafe {
  id: string;  // Place ID from Google Maps
  name: string;  // Extracted from Google Maps API
  coordinate: {
    latitude: number;
    longitude: number;
  };
  rating: number;  // Extracted from Google Maps API
  image: string;  // Banner
  // address: string;
  // openingHours: string;
  // phone: string;
  saved: boolean; // Indicates if the cafe is saved in the user's favorites
  website?: string; // Optional link to the cafe's website
  menu?: menuItem[]; // Optional menu items for the cafe
}

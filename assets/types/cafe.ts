import { menuItem } from "./menu-item";

export interface Cafe {
  id: number;
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  image: string;
  address: string;
  openingHours: string;
  phone: string;
  saved: boolean; // Indicates if the cafe is saved in the user's favorites
  website?: string; // Optional link to the cafe's website
  menu?: menuItem[]; // Optional menu items for the cafe
}

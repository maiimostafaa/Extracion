// sample cafe data for the cafe map mockup

import { Cafe } from "../types/cafe";
import { mockMenuItems } from "./mock-menuItems";

export const mockCafes: Cafe[] = [
  {
    id: 1,
    name: "Urban Coffee Lab",
    coordinate: { latitude: 37.7749, longitude: -122.4194 },
    rating: 4.5,
    image: "https://picsum.photos/400/300?random=1",
    address: "123 Coffee Street, San Francisco",
    openingHours: "Mon-Fri: 7AM-8PM, Sat-Sun: 8AM-9PM",
    phone: "(555) 123-4567",
    saved: false,
    website: "https://urbancoffeelab.com",
    menu: [
      mockMenuItems[0], // Espresso
      mockMenuItems[1], // Latte
    ],
  },
  {
    id: 2,
    name: "Brew & Co",
    coordinate: { latitude: 37.7833, longitude: -122.4167 },
    rating: 4.8,
    image: "https://picsum.photos/400/300?random=2",
    address: "456 Brew Avenue, San Francisco",
    openingHours: "Mon-Sun: 6AM-10PM",
    phone: "(555) 234-5678",
    saved: true,
    website: "https://brewandco.com",
    menu: [
      mockMenuItems[2], // Cappuccino
      mockMenuItems[3], // Cold Brew
    ],
  },
  {
    id: 3,
    name: "Coffee House",
    coordinate: { latitude: 37.785, longitude: -122.4067 },
    rating: 4.3,
    image: "https://picsum.photos/400/300?random=3",
    address: "789 Bean Road, San Francisco",
    openingHours: "Mon-Fri: 6:30AM-7PM, Sat-Sun: 7AM-8PM",
    phone: "(555) 345-6789",
    saved: false,
    website: "https://coffeehouse.com",
    menu: [
      mockMenuItems[4], // Green Tea
      mockMenuItems[5], // Berry Smoothie
    ],
  },
  {
    id: 4,
    name: "Café de Flore",
    coordinate: { latitude: 48.8534, longitude: 2.3347 },
    rating: 4.7,
    image: "https://picsum.photos/400/300?random=4",
    address: "172 Boulevard Saint-Germain, Paris",
    openingHours: "Mon-Sun: 7AM-1AM",
    phone: "+33 1 45 48 55 26",
    saved: false,
    website: "https://cafedeflore.com",
    menu: [
      mockMenuItems[0], // Espresso
      mockMenuItems[3], // Cold Brew
    ],
  },
];

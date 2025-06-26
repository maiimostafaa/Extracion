import { menuItem } from "../types/menu-item";

export const mockMenuItems: menuItem[] = [
  {
    id: "1",
    name: "Espresso",
    description: "A strong and bold coffee shot.",
    price: 2.5,
    image: "https://via.placeholder.com/150",
    isAvailable: true,
    ingredients: ["Espresso"],
  },
  {
    id: "2",
    name: "Latte",
    description: "A creamy coffee with steamed milk.",
    price: 3.5,
    image: "https://via.placeholder.com/150",
    isAvailable: true,
    ingredients: ["Espresso", "Steamed Milk"],
  },
  {
    id: "3",
    name: "Cappuccino",
    description: "A coffee with steamed milk and foam.",
    price: 3.8,
    image: "https://via.placeholder.com/150",
    isAvailable: true,
    ingredients: ["Espresso", "Steamed Milk", "Foam"],
  },
  {
    id: "4",
    name: "Cold Brew",
    description: "A smooth and refreshing coffee.",
    price: 4.0,
    image: "https://via.placeholder.com/150",
    isAvailable: false, // Currently unavailable
    ingredients: ["Cold Brew Coffee", "Ice"],
  },
  {
    id: "5",
    name: "Green Tea",
    description: "A healthy and refreshing tea.",
    price: 2.0,
    image: "https://via.placeholder.com/150",
    isAvailable: true,
    ingredients: ["Green Tea Leaves", "Hot Water"],
  },
  {
    id: "6",
    name: "Berry Smoothie",
    description: "A sweet and fruity smoothie.",
    price: 4.5,
    image: "https://via.placeholder.com/150",
    isAvailable: true,
    ingredients: ["Mixed Berries", "Yogurt", "Honey"],
  },
];
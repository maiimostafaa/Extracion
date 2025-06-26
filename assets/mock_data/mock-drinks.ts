//sample drink log data for the brew log mockup

import { drink } from "../types/drink";

export const mockDrinks: drink[] = [
  {
    id: 1,
    name: "Pour Over Coffee",
    brewMethod: "pour over",
    image: "https://via.placeholder.com/150",
    date: "2023-10-01",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Cold Brew Coffee",
    brewMethod: "cold brew",
    image: "https://via.placeholder.com/150",
    date: "2023-10-02",
    rating: 4.8,
  },
  {
    id: 3,
    name: "French Press Coffee",
    brewMethod: "french press",
    image: "https://via.placeholder.com/150",
    date: "2023-10-03",
    rating: 4.2,
  },
  {
    id: 4,
    name: "Brew Bar Espresso",
    brewMethod: "brew bar",
    image: "https://via.placeholder.com/150",
    date: "2023-10-04",
    rating: 5.0,
  },
  {
    id: 5,
    name: "Classic French Press",
    brewMethod: "french press",
    image: "https://via.placeholder.com/150",
    date: "2023-10-05",
    rating: 4.0,
  },
];
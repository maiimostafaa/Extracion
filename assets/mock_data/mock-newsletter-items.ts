import { newsletterItem } from "../types/newsletter-item";

export const mockNewsletterItems: newsletterItem[] = [
  {
    id: "1",
    title: "How to Brew the Perfect Coffee",
    description: "Learn the secrets to brewing the perfect cup of coffee.",
    thumbnail: "https://picsum.photos/400/300?random=1",
    date: "2023-10-01",
    createdBy: "Coffee Co.",
    category: "Coffee Recipe",

    media_url: "https://example.com/videos/perfect-coffee.mp4",
  },
  {
    id: "2",
    title: "5 Tips for Latte Art",
    description: "Master the art of creating beautiful latte designs.",
    thumbnail: "https://picsum.photos/400/300?random=2",
    date: "2023-10-02",
    createdBy: "Latte Masters",
    category: "Coffee Recipe",
    media_url: "https://via.placeholder.com/300",
  },
  {
    id: "3",
    title: "20% Off All Coffee Beans",
    description: "Enjoy a 20% discount on all coffee beans this week only.",
    thumbnail: "https://picsum.photos/400/300?random=3",
    date: "2023-10-03",
    createdBy: "Coffee Co.",
    category: "Promotion",
    media_url: "https://example.com/images/coffee-beans-sale.jpg",
  },
  {
    id: "4",
    title: "KOL Featuring: John Doe",
    description: "Learn how John Doe brews his favorite coffee.",
    thumbnail: "https://picsum.photos/400/300?random=4",
    date: "2023-10-04",
    createdBy: "Coffee Co.",
    category: "KOL Featuring",
    media_url: "https://example.com/videos/john-doe-coffee.mp4",
  },
  {
    id: "5",
    title: "The Ultimate Coffee Guide",
    description: "Everything you need to know about coffee in one guide.",
    thumbnail: "https://picsum.photos/400/300?random=5",
    date: "2023-10-05",
    createdBy: "Coffee Co.",
    category: "Coffee Recipe",
    media_url: "https://via.placeholder.com/300",
  },
];
export default mockNewsletterItems;

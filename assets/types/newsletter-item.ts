export interface newsletterItem {
  id: string; // Unique identifier for the item
  title: string; // Title of the item
  description: string; // Short description of the item
  thumbnail: any; // URL or path to the thumbnail image
  date: string; // Date the item was created or published
  createdBy: string; // Author or creator of the item
  category: "coffee recipe" | "KOL featuring" | "promotion";
  media_url: string; // URL to the media content (video, image, etc.)
}

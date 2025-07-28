export interface newsletterItem {
  id: string; // Unique identifier for the item
  title: string; // Title of the item
  description: string; // Short description of the item
  thumbnail: any; // URL or path to the thumbnail image
  date: string; // Date the item was created or published
  createdBy: string; // Author or creator of the item
  category: "Coffee Recipe" | "KOL Featuring" | "Promotion";
  media_type?: "VIDEO" | "IMAGE" | "CAROUSEL_ALBUM"; // Type of media content
  media_types?: string[]; // Array of media types if multiple
  media_url: string; // URL to the media content (video, image, etc.)
  media_urls?: string[]; // Optional array of media URLs for multiple items
  permalink?: string; // Optional permalink to the item
  like_count?: string;
  comments_count?: string;
}

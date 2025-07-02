export type newsletterItem = VideoItem | TextItem;

interface BaseNewsletterItem {
  id: string; // Unique identifier for the item
  title: string; // Title of the item
  description: string; // Short description of the item
  thumbnail: any; // URL or path to the thumbnail image
  date: string; // Date the item was created or published
  createdBy: string; // Author or creator of the item
  category: "coffee recipe" | "KOL featuring" | "promotion";
}

interface VideoItem extends BaseNewsletterItem {
  type: "video"; // Discriminator for video items
  videoUrl: string; // URL or path to the video file
  duration: string; // Duration of the video (e.g., "2:30")
}

interface TextItem extends BaseNewsletterItem {
  type: "textPost"; // Discriminator for text posts
  content: string; // Detailed text content of the post
  images?: string[]; // Optional array of image URLs for the post
}

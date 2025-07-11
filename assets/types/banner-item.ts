export interface bannerItem {
  id: string; // Unique identifier for the banner item
  title: string; // Title of the banner item
  subtitle?: string; // Optional subtitle for the banner item
  image_url: string; // URL of the banner image
  category: string; // Category of the banner item
  action_url?: string; // Optional URL to navigate to on click
  start_date: string; // Start date for the banner item
  end_date: string; // End date for the banner item
  priority: number; // Priority for sorting banners
  is_active: boolean; // Indicates if the banner is currently active
}

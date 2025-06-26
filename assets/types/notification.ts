import { User } from "./user";

export interface Notification {
    id: string;
    sender: User; // User who triggered the notification
    recipient: User; // User who will receive the notification
    media?: string; // Optional: URL or local path to media file
    title: string; // Notification title
    message: string; // Notification message
    timestamp: string; // When the notification was created
    read: boolean; // Whether the notification has been read
    type: "like" | "comment" | "save" | "follow" | "mention" | "liked-comment" | "replied-comment"; // Type of notification
    data?: NotificationData; // Optional: Additional data for specific notification types
  }
  
  export interface NotificationData {
    postId?: string; // ID of the post being liked, commented on, or saved
    commentId?: string; // ID of the comment (for comment notifications)
    mentionedUserId?: string; // ID of the mentioned (for mentions)
    savedByUserId?: string; // ID of the user who saved the post
  }

import { User } from "./user";

export interface PostComment {
    id: string;
    user: User;
    content: string;
    timestamp: string;
    likes: User[]; // Users who liked the comment
    replies: PostComment[]; // Nested comments (replies)
  }
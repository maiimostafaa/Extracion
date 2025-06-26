import { User } from "./user";
import { PostComment } from "./comment";

export interface Post {
    id: string;
    user: User;
    content: string;
    type: "image" | "video"; //type of post contet
    image?: any; // URL or local path to the video file
    video?: any; // URL or local path to the video file
    likes: User[];
    comments: PostComment[];
    timestamp: string;
    liked: boolean;
  }
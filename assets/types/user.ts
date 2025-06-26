
export interface User {
    id: string; // Unique identifier for the user
    name: string; // User's name
    avatar: string; // URL or local path to the user's avatar
    email: string; // email address
    bio?: string; // Optional user bio
  }
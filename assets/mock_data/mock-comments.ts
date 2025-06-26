//sample comment data for the post comments mockup

import { PostComment } from "../types/comment";
import { mockUsers } from "./mock-users";

export const mockComments: PostComment[] = [
  {
    id: "201",
    user: mockUsers.find((user) => user.id === "101")!, // Reference user from mockUsers
    content: "This is a great post!",
    timestamp: "2023-10-01T12:00:00Z",
    likes: [
      mockUsers.find((user) => user.id === "102")!, // Reference user from mockUsers
      mockUsers.find((user) => user.id === "103")!, // Reference user from mockUsers
    ],
    replies: [],
  },
  {
    id: "203",
    user: mockUsers.find((user) => user.id === "102")!, // Reference user from mockUsers
    content: "Amazing content, keep it up!",
    timestamp: "2023-10-01T12:10:00Z",
    likes: [
      mockUsers.find((user) => user.id === "103")!, // Reference user from mockUsers
    ],
    replies: [
      {
        id: "204",
        user: mockUsers.find((user) => user.id === "101")!, // Reference user from mockUsers
        content: "Thanks for the support!",
        timestamp: "2023-10-01T12:15:00Z",
        likes: [],
        replies: [],
      },
    ],
  },
];

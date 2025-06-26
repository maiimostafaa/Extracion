//sample post data for the social feed mockup

import { Post } from "../types/post";
import { mockUsers } from "./mock-users";
import { mockComments } from "./mock-comments";

export const mockPosts: Post[] = [
  {
    id: "1",
    user: mockUsers.find((user) => user.id === "101")!, // Reference user from mockUsers
    content: "Enjoying my coffee at Bluebird Cafe!",
    type: "image",
    image: "https://via.placeholder.com/300",
    video: undefined,
    likes: [
      mockUsers.find((user) => user.id === "102")!, // Reference user from mockUsers
      mockUsers.find((user) => user.id === "103")!, // Reference user from mockUsers
    ],
    comments: [
      mockComments.find((PostComment) => PostComment.id === "201")!, // Reference comment from mockComments
    ],
    timestamp: "2023-10-01T12:00:00Z",
    liked: true,
  },
  {
    id: "2",
    user: mockUsers.find((user) => user.id === "102")!, // Reference user from mockUsers
    content: "Check out this amazing latte art!",
    type: "video",
    image: undefined,
    video: "https://via.placeholder.com/300",
    likes: [
      mockUsers.find((user) => user.id === "103")!, // Reference user from mockUsers
      mockUsers.find((user) => user.id === "104")!, // Reference user from mockUsers
    ],
    comments: [], // Reference mockComments
    timestamp: "2023-10-01T12:05:00Z",
    liked: false,
  },
];

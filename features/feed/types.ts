// Feed-domain types. Mirrors backend PostDto / CommentDto shapes.

import type { PublicUser } from '@/features/users/types';

export type PostVisibility = 'PUBLIC' | 'PRIVATE';

export interface Post {
  id: string;
  content: string;
  imageKey: string | null;
  imageUrl: string | null;
  visibility: PostVisibility;
  author: PublicUser;
  likeCount: number;
  hasLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  author: PublicUser;
  replyCount: number;
  likeCount: number;
  hasLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  id: string;
  name: string;
  imageKey: string;
  miniImageKey: string;
}

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
  /**
   * Up to 3 most recent likers, embedded by the backend in a single window-
   * function query — eliminates the per-card N+1 we used to do via
   * `usePostLikers`. Empty array when no one has liked yet.
   */
  topLikers: PublicUser[];
  /**
   * Total top-level comments on the post. Currently not exposed by the
   * backend — when the comments feature lands, the backend will add this
   * field to PostDto and these `?? 0` defaults in the UI become real.
   */
  commentCount?: number;
  /** Same shape — will populate when share feature lands. */
  shareCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  id: string;
  name: string;
  imageKey: string;
  miniImageKey: string;
}

export interface FeedMeta {
  hasMore: boolean;
  nextCursor: string | null;
  limit: number;
}

export interface FeedPage {
  data: Post[];
  meta: FeedMeta;
}

import type { PublicUser } from '@/features/users/types';
import type { Comment, Post, Story } from '../types';

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();

const author1: PublicUser = {
  id: 'u1',
  firstName: 'Karim',
  lastName: 'Saif',
  avatarKey: '/assets/images/post_img.png',
};

export const mockStories: Story[] = [
  {
    id: 's1',
    name: 'Ryan Roslansky',
    imageKey: '/assets/images/card_ppl2.png',
    miniImageKey: '/assets/images/mini_pic.png',
  },
  {
    id: 's2',
    name: 'Ryan Roslansky',
    imageKey: '/assets/images/card_ppl3.png',
    miniImageKey: '/assets/images/mini_pic.png',
  },
  {
    id: 's3',
    name: 'Ryan Roslansky',
    imageKey: '/assets/images/card_ppl4.png',
    miniImageKey: '/assets/images/mini_pic.png',
  },
];

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    content: '-Healthy Tracking App',
    imageKey: '/assets/images/timeline_img.png',
    imageUrl: '/assets/images/timeline_img.png',
    visibility: 'PUBLIC',
    author: author1,
    likeCount: 23,
    hasLiked: false,
    createdAt: minutesAgo(5),
    updatedAt: minutesAgo(5),
  },
  {
    id: 'post-2',
    content: '-Healthy Tracking App',
    imageKey: '/assets/images/timeline_img.png',
    imageUrl: '/assets/images/timeline_img.png',
    visibility: 'PUBLIC',
    author: author1,
    likeCount: 41,
    hasLiked: true,
    createdAt: minutesAgo(45),
    updatedAt: minutesAgo(45),
  },
];

export const mockComments: Record<string, Comment[]> = {
  'post-1': [
    {
      id: 'c1',
      postId: 'post-1',
      parentId: null,
      content:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      author: {
        id: 'u5',
        firstName: 'Radovan',
        lastName: 'SkillArena',
        avatarKey: '/assets/images/txt_img.png',
      },
      replyCount: 2,
      likeCount: 198,
      hasLiked: false,
      createdAt: minutesAgo(21),
      updatedAt: minutesAgo(21),
    },
  ],
};

export const mockReplies: Record<string, Comment[]> = {
  c1: [
    {
      id: 'r1',
      postId: 'post-1',
      parentId: 'c1',
      content: 'Totally agree with this take.',
      author: {
        id: 'u6',
        firstName: 'Ahsan',
        lastName: 'Khan',
        avatarKey: '/assets/images/comment_img.png',
      },
      replyCount: 0,
      likeCount: 4,
      hasLiked: true,
      createdAt: minutesAgo(15),
      updatedAt: minutesAgo(15),
    },
  ],
};

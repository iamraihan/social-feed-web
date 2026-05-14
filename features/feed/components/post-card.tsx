'use client';

import { AppImage } from '@/components/ui/app-image';
import type { SessionUser } from '@/features/auth/types';
import { PostHeader } from './post-header';
import { PostReactions } from './post-reactions';
import type { Post } from '../types';

// _feed_inner_timeline_post_area — orchestrator: header → content → image →
// react stack + buttons. Comments / replies UI lands with the comments
// branch; this PR keeps the visual block but only the like button is wired.

interface PostCardProps {
  post: Post;
  currentUser: SessionUser;
}

export function PostCard({ post, currentUser }: PostCardProps) {
  const isOwnPost = post.author.id === currentUser.id;

  return (
    <article className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <PostHeader post={post} isOwnPost={isOwnPost} />

        <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>

        {post.imageUrl && (
          <div className="_feed_inner_timeline_image">
            <AppImage
              src={post.imageUrl}
              alt=""
              width={700}
              height={420}
              className="_time_img"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        )}
      </div>

      <PostReactions post={post} />
    </article>
  );
}

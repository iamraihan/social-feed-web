import { AppImage } from '@/components/ui/app-image';
import type { Comment, Post } from '../types';
import { mockComments, mockReplies } from '../data/mock';
import { PostHeader } from './post-header';
import { PostReactions } from './post-reactions';
import { CommentBox } from './comment-box';
import { CommentItem } from './comment-item';

// _feed_inner_timeline_post_area — orchestrator: header → title → image →
// react stack + buttons → write-a-comment composer → previous-comments list.

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const comments: Comment[] = mockComments[post.id] ?? [];

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <PostHeader author={post.author} />

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
              unoptimized
            />
          </div>
        )}
      </div>

      <PostReactions />

      <div className="_feed_inner_timeline_cooment_area">
        <CommentBox />
      </div>

      {comments.length > 0 && (
        <div className="_timline_comment_main">
          <div className="_previous_comment">
            <button type="button" className="_previous_comment_txt">
              View 4 previous comments
            </button>
          </div>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={mockReplies[comment.id] ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}

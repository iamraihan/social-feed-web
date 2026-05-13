import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import type { Comment } from '../types';

// _comment_main row — avatar + name + body + reactions + reply/like links.
// Replies are passed in but not rendered (keep flat for now; nested reply
// expansion will return when wired to real interaction state).

interface CommentItemProps {
  comment: Comment;
  replies?: Comment[];
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <Link href="#0" className="_comment_image_link">
          <Avatar
            src={comment.author.avatarKey}
            alt=""
            size={40}
            className="_comment_img1"
            fallback="/assets/images/txt_img.png"
          />
        </Link>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <Link href="#0">
                <h4 className="_comment_name_title">
                  {comment.author.firstName} {comment.author.lastName}
                </h4>
              </Link>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.content}</span>
            </p>
          </div>
          <div className="_total_reactions">
            <span className="_total">{comment.likeCount}</span>
          </div>
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li>
                  <span>Like.</span>
                </li>
                <li>
                  <span>Reply.</span>
                </li>
                <li>
                  <span>Share</span>
                </li>
                <li>
                  <span className="_time_link">.21m</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

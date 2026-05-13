import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import type { PublicUser } from '@/features/users/types';

// Top row of a post — avatar, name, "5 minute ago . Public", 3-dot button.

interface PostHeaderProps {
  author: PublicUser;
}

export function PostHeader({ author }: PostHeaderProps) {
  return (
    <div className="_feed_inner_timeline_post_top">
      <div className="_feed_inner_timeline_post_box">
        <div className="_feed_inner_timeline_post_box_image">
          <Avatar
            src={author.avatarKey}
            alt=""
            size={48}
            className="_post_img"
            fallback="/assets/images/post_img.png"
          />
        </div>
        <div className="_feed_inner_timeline_post_box_txt">
          <h4 className="_feed_inner_timeline_post_box_title">
            {author.firstName} {author.lastName}
          </h4>
          <p className="_feed_inner_timeline_post_box_para">
            5 minute ago . <Link href="#0">Public</Link>
          </p>
        </div>
      </div>
      <div className="_feed_inner_timeline_post_box_dropdown">
        <div className="_feed_timeline_post_dropdown">
          <button type="button" className="_feed_timeline_post_dropdown_link" aria-label="Post options">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="4"
              height="17"
              fill="none"
              viewBox="0 0 4 17"
            >
              <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
              <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
              <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

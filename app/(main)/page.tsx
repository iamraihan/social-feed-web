import type { Metadata } from 'next';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
// TODO(feed-integration): replace `mockPosts` with `await getFeed()` from
// `@/features/feed/api` once the API integration branch lands. The Server
// Component shape stays the same — just swap the import.
import { Stories, PostComposer, PostCard, mockPosts } from '@/features/feed';

export const metadata: Metadata = {
  title: 'Home',
};

// Home `/` mirrors feed.html's main layout:
//   _custom_container > _layout_inner_wrap > row
//     col-3 LeftSidebar | col-6 middle | col-3 RightSidebar

export default function HomePage() {
  return (
    <div className="container _custom_container">
      <div className="_layout_inner_wrap">
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
            <LeftSidebar />
          </div>

          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <div className="_layout_middle_wrap">
              <div className="_layout_middle_inner">
                <Stories />
                <PostComposer />
                {mockPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

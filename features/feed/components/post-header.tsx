"use client";

import { useState, useSyncExternalStore } from "react";
import { Avatar } from "@/components/ui/avatar";
import { deletePostAction } from "../actions/delete-post-action";
import type { Post } from "../types";

// Top row of a post — avatar, name, relative time, visibility, 3-dot menu.
// Menu owns its open/close state so this slice is a Client Component.

interface PostHeaderProps {
  post: Post;
  /** Author of the post can see Delete in the menu. */
  isOwnPost: boolean;
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString();
}

// Relative-time labels depend on Date.now() and the browser's locale, both
// of which differ from the server. useSyncExternalStore returns false during
// SSR and true after hydration, so we render the stable ISO on the server
// and swap to the relative label on the client without cascading renders.
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function PostHeader({ post, isOwnPost }: PostHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const timeLabel = isClient ? timeAgo(post.createdAt) : post.createdAt;

  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setIsDeleting(true);
    const result = await deletePostAction(post.id);
    setIsDeleting(false);
    setMenuOpen(false);
    if (!result.ok) alert(result.error);
    // Success path is handled by revalidatePath + TanStack invalidation in
    // the action layer + the FeedList wrapper.
  }

  return (
    <div className="_feed_inner_timeline_post_top">
      <div className="_feed_inner_timeline_post_box">
        <div className="_feed_inner_timeline_post_box_image">
          <Avatar
            src={post.author.avatarKey}
            alt={`${post.author.firstName} ${post.author.lastName}`}
            name={`${post.author.firstName} ${post.author.lastName}`}
            size={48}
            className="_post_img"
          />
        </div>
        <div className="_feed_inner_timeline_post_box_txt">
          <h4 className="_feed_inner_timeline_post_box_title">
            {post.author.firstName} {post.author.lastName}
          </h4>
          <p className="_feed_inner_timeline_post_box_para">
            <time dateTime={post.createdAt} suppressHydrationWarning>
              {timeLabel}
            </time>
            {" . "}
            <span>{post.visibility === "PUBLIC" ? "Public" : "Private"}</span>
          </p>
        </div>
      </div>
      <div className="_feed_inner_timeline_post_box_dropdown">
        <div className="_feed_timeline_post_dropdown">
          <button
            type="button"
            className="_feed_timeline_post_dropdown_link btn-reset"
            aria-label="Post options"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
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
        {menuOpen && isOwnPost && (
          <div
            className="_feed_timeline_dropdown _timeline_dropdown"
            style={{ display: "block" }}
          >
            <ul className="_feed_timeline_dropdown_list">
              <li className="_feed_timeline_dropdown_item">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="_feed_timeline_dropdown_link nav-dropdown-form-button"
                >
                  {isDeleting ? "Deleting…" : "Delete Post"}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

import 'server-only';
import { authenticatedFetch } from '@/lib/auth-fetch';

// Wrappers around backend /likes/:type/:id. Today only POST targets are
// wired (post-level likes); COMMENT / REPLY targets land with the comments
// feature. Paginated `listPostLikers` will return when the "Who liked"
// modal is built — backend endpoint already exists at GET
// /likes/post/:id/users.

export async function likePost(postId: string): Promise<void> {
  await authenticatedFetch<{ liked: true }>(`/likes/post/${postId}`, {
    method: 'POST',
  });
}

export async function unlikePost(postId: string): Promise<void> {
  await authenticatedFetch<void>(`/likes/post/${postId}`, { method: 'DELETE' });
}

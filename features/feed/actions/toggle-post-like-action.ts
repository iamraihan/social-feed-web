'use server';

import { ApiClientError } from '@/lib/api-client';
import { logError } from '@/lib/safe-log';
import { requireSession } from '@/features/auth/lib/session';
import { likePost, unlikePost } from '../api/likes-api';

type ToggleLikeResult = { ok: true } | { ok: false; error: string };

export async function togglePostLikeAction(input: {
  postId: string;
  liked: boolean;
}): Promise<ToggleLikeResult> {
  await requireSession();
  try {
    if (input.liked) {
      await likePost(input.postId);
    } else {
      await unlikePost(input.postId);
    }
    return { ok: true };
  } catch (err) {
    if (err instanceof ApiClientError) {
      logError('[feed/like] backend error', {
        code: err.code,
        status: err.status,
        postId: input.postId,
      });
      return { ok: false, error: err.message };
    }
    return { ok: false, error: 'Could not update like. Try again.' };
  }
}

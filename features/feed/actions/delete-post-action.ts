'use server';

import { revalidatePath } from 'next/cache';
import { ApiClientError } from '@/lib/api-client';
import { logError } from '@/lib/safe-log';
import { requireSession } from '@/features/auth/lib/session';
import { deletePost } from '../api/feed-api';

type DeletePostResult = { ok: true } | { ok: false; error: string };

export async function deletePostAction(
  postId: string,
): Promise<DeletePostResult> {
  await requireSession();
  try {
    await deletePost(postId);
    revalidatePath('/');
    return { ok: true };
  } catch (err) {
    if (err instanceof ApiClientError) {
      if (err.code === 'FORBIDDEN') {
        return { ok: false, error: 'You can only delete your own posts.' };
      }
      logError('[feed/delete] backend error', {
        code: err.code,
        status: err.status,
        postId,
      });
      return { ok: false, error: err.message };
    }
    return { ok: false, error: 'Could not delete post. Try again.' };
  }
}

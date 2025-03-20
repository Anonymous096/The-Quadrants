import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { likes } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const postId = parseInt(params.postId);
    if (isNaN(postId)) {
      return new NextResponse('Invalid post ID', { status: 400 });
    }

    // Check if the user has already liked the post
    const existingLike = await db.query.likes.findFirst({
      where: and(
        eq(likes.postId, postId),
        eq(likes.userId, userId)
      ),
    });

    if (existingLike) {
      // Unlike the post
      await db.delete(likes).where(
        and(
          eq(likes.postId, postId),
          eq(likes.userId, userId)
        )
      );
    } else {
      // Like the post
      await db.insert(likes).values({
        postId,
        userId,
      });
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.error('[POSTS_LIKE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
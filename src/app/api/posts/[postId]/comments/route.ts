import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { comments } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.userId;
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const postId = parseInt(params.postId);
    if (isNaN(postId)) {
      return new NextResponse('Invalid post ID', { status: 400 });
    }

    const { content } = await req.json();
    if (!content) {
      return new NextResponse('Missing content', { status: 400 });
    }

    const comment = await db.insert(comments).values({
      content,
      postId,
      userId,
    }).returning();

    return NextResponse.json(comment[0]);
  } catch (error) {
    console.error('[POSTS_COMMENTS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = parseInt(params.postId);
    if (isNaN(postId)) {
      return new NextResponse('Invalid post ID', { status: 400 });
    }

    const postComments = await db.query.comments.findMany({
      where: eq(comments.postId, postId),
      orderBy: [desc(comments.createdAt)],
      with: {
        user: {
          columns: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(postComments);
  } catch (error) {
    console.error('[POSTS_COMMENTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
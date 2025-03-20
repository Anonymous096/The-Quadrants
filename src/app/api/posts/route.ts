import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { posts, likes } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    const user = await currentUser();
    
    if (!userId || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, content } = await req.json();
    if (!title || !content) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const post = await db.insert(posts).values({
      title,
      content,
      userId,
    }).returning();

    // Return post with user data
    return NextResponse.json({
      ...post[0],
      user: {
        name: user.firstName + ' ' + user.lastName,
        image: user.imageUrl,
      },
      _count: {
        likes: 0,
        comments: 0,
      },
      isLiked: false,
    });
  } catch (error) {
    console.error('[POSTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const allPosts = await db.query.posts.findMany({
      orderBy: [desc(posts.createdAt)],
      with: {
        likes: {
          where: eq(likes.userId, userId),
        },
        _count: {
          columns: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // Fetch all users data from Clerk for the posts
    const users = await Promise.all(
      [...new Set(allPosts.map(post => post.userId))].map(async (userId) => {
        try {
          const user = await fetch(
            `https://api.clerk.dev/v1/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
              },
            }
          ).then(res => res.json());
          
          return {
            id: userId,
            name: user.first_name + ' ' + user.last_name,
            image: user.image_url,
          };
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
          return {
            id: userId,
            name: 'Unknown User',
            image: null,
          };
        }
      })
    );

    const usersMap = Object.fromEntries(users.map(user => [user.id, user]));

    const transformedPosts = allPosts.map(post => ({
      ...post,
      isLiked: post.likes?.length > 0,
      likes: undefined,
      user: usersMap[post.userId] || {
        name: 'Unknown User',
        image: null,
      },
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('[POSTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
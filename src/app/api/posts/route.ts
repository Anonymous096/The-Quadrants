import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { posts, likes, comments } from '@/lib/db/schema';
import { desc, eq, and, sql } from 'drizzle-orm';

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
    console.log('GET /api/posts - Start');
    const session = await auth();
    const userId = session?.userId;
    
    console.log('Auth check:', { userId });
    
    if (!userId) {
      console.log('Unauthorized - no userId');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('Fetching posts from database...');
    const allPosts = await db.select().from(posts)
      .orderBy(desc(posts.createdAt));
    
    console.log('Posts fetched:', allPosts.length);

    // Get likes count and comments for each post
    const postsWithLikesAndComments = await Promise.all(
      allPosts.map(async (post) => {
        const likesCount = await db.select({ count: sql`count(*)` })
          .from(likes)
          .where(eq(likes.postId, post.id));
        
        // Fetch comments with their creation time
        const postComments = await db.select()
          .from(comments)
          .where(eq(comments.postId, post.id))
          .orderBy(desc(comments.createdAt));
        
        const isLiked = await db.select()
          .from(likes)
          .where(and(
            eq(likes.postId, post.id),
            eq(likes.userId, userId)
          ))
          .then(result => result.length > 0);

        return {
          ...post,
          _count: {
            likes: Number(likesCount[0].count),
            comments: postComments.length,
          },
          comments: postComments,
          isLiked,
        };
      })
    );

    console.log('Posts processed with likes and comments');

    // Get unique user IDs from both posts and comments
    const userIds = new Set([
      ...postsWithLikesAndComments.map(post => post.userId),
      ...postsWithLikesAndComments.flatMap(post => 
        post.comments.map(comment => comment.userId)
      )
    ]);

    // Fetch all users data from Clerk
    const users = await Promise.all(
      [...userIds].map(async (userId) => {
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

    console.log('Users fetched from Clerk');

    const usersMap = Object.fromEntries(users.map(user => [user.id, user]));

    const transformedPosts = postsWithLikesAndComments.map(post => ({
      ...post,
      user: usersMap[post.userId] || {
        name: 'Unknown User',
        image: null,
      },
      comments: post.comments.map(comment => ({
        ...comment,
        user: usersMap[comment.userId] || {
          name: 'Unknown User',
          image: null,
        }
      }))
    }));

    console.log('GET /api/posts - Success');
    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('[POSTS_GET] Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 
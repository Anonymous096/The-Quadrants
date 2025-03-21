"use client";

import { useEffect, useState } from "react";
import { PostEditor } from "@/components/post/PostEditor";
import { PostCard } from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  title: string;
  content: any;
  userId: string;
  createdAt: string;
  user: {
    name: string;
    image?: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
  isLiked: boolean;
  comments: {
    id: number;
    content: string;
    userId: string;
    createdAt: string;
    user: {
      name: string;
      image?: string;
    };
  }[];
}

export default function PostsPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [showEditor, setShowEditor] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/auth/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const fetchPosts = async () => {
    try {
      console.log("Fetching posts...");
      const response = await fetch("/api/posts");

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Error response:", {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
          headers: Object.fromEntries(response.headers.entries()),
        });
        throw new Error(
          `Failed to fetch posts: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Posts fetched successfully:", data.length);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchPosts();
    }
  }, [isLoaded, isSignedIn]);

  const handleCreatePost = async (title: string, content: any) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      await fetchPosts(); // Refresh posts after creating new one
      setShowEditor(false);
      toast({
        title: "Success",
        description: "Post created successfully",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to like post");
      }

      // Update posts state optimistically
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: !post.isLiked,
              _count: {
                ...post._count,
                likes: post.isLiked
                  ? post._count.likes - 1
                  : post._count.likes + 1,
              },
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const handleComment = async (postId: number, content: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      // Refresh posts to get updated comment count
      await fetchPosts();
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to create comment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Button
          onClick={() => setShowEditor(!showEditor)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          {showEditor ? "Cancel" : "Create Post"}
        </Button>
      </div>

      {showEditor && (
        <div className="mb-8">
          <PostEditor onSubmit={handleCreatePost} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={{ ...post, createdAt: new Date(post.createdAt) }}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))}
          {posts.length === 0 && (
            <div className="text-center text-gray-500">
              No posts yet. Be the first to create one!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
